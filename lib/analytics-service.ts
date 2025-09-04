import { prisma } from "./prisma"
import type { Topic } from "./types"

export interface AnalyticsData {
  overallStats: {
    totalSessions: number
    averageScore: number
    averageAccuracy: number
    totalQuestionsAnswered: number
    averageTimePerQuestion: number
  }
  recentSessions: Array<{
    id: string
    score: number
    accuracy: number
    duration: number
    topics: Topic[]
    createdAt: Date
  }>
  topicPerformance: Array<{
    topic: Topic
    averageAccuracy: number
    totalQuestions: number
    correctAnswers: number
    averageTime: number
  }>
  progressOverTime: Array<{
    date: string
    score: number
    accuracy: number
  }>
  timeDistribution: Array<{
    timeRange: string
    count: number
  }>
  suggestions: string[]
}

// Define types for session and answer to help with type safety
type PrismaSession = {
  id: string
  score: number
  accuracy: number
  duration: number
  topics: Topic[]
  createdAt: Date
  answers: PrismaAnswer[]
}

type PrismaAnswer = {
  isCorrect: boolean
  timeTaken: number
  question: {
    topic: Topic
  }
}

export class AnalyticsService {
  static async getUserAnalytics(userId: string): Promise<AnalyticsData> {
    // Get all user sessions
    const sessions: PrismaSession[] = await prisma.practiceSession.findMany({
      where: { userId },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    if (sessions.length === 0) {
      return this.getEmptyAnalytics()
    }

    // Calculate overall stats
    const totalSessions: number = sessions.length
    const averageScore: number =
      sessions.reduce((sum: number, s: PrismaSession) => sum + s.score, 0) / totalSessions
    const averageAccuracy: number =
      sessions.reduce((sum: number, s: PrismaSession) => sum + s.accuracy, 0) / totalSessions
    const totalQuestionsAnswered: number = sessions.reduce(
      (sum: number, s: PrismaSession) => sum + s.answers.length,
      0,
    )
    const totalTime: number = sessions.reduce((sum: number, s: PrismaSession) => sum + s.duration, 0)
    const averageTimePerQuestion: number = totalTime / totalQuestionsAnswered

    // Recent sessions (last 10)
    const recentSessions: AnalyticsData["recentSessions"] = sessions.slice(0, 10).map((session: PrismaSession) => ({
      id: session.id,
      score: session.score,
      accuracy: session.accuracy,
      duration: session.duration,
      topics: session.topics,
      createdAt: session.createdAt,
    }))

    // Topic performance analysis
    const topicStats: Record<string, { correct: number; total: number; totalTime: number }> = {}

    sessions.forEach((session: PrismaSession) => {
      session.answers.forEach((answer: PrismaAnswer) => {
        const topic = answer.question.topic
        if (!topicStats[topic]) {
          topicStats[topic] = { correct: 0, total: 0, totalTime: 0 }
        }
        topicStats[topic].total++
        topicStats[topic].totalTime += answer.timeTaken
        if (answer.isCorrect) {
          topicStats[topic].correct++
        }
      })
    })

    const topicPerformance: AnalyticsData["topicPerformance"] = Object.entries(topicStats).map(
      ([topic, stats]) => ({
        topic: topic as Topic,
        averageAccuracy: stats.correct / stats.total,
        totalQuestions: stats.total,
        correctAnswers: stats.correct,
        averageTime: stats.totalTime / stats.total,
      }),
    )

    // Progress over time (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentSessionsForProgress: PrismaSession[] = sessions
      .filter((s: PrismaSession) => s.createdAt >= thirtyDaysAgo)
      .reverse() // Oldest first for chronological order

    const progressOverTime: AnalyticsData["progressOverTime"] = recentSessionsForProgress.map(
      (session: PrismaSession) => ({
        date: session.createdAt.toISOString().split("T")[0],
        score: session.score,
        accuracy: Math.round(session.accuracy * 100),
      }),
    )

    // Time distribution analysis
    const timeRanges = [
      { min: 0, max: 5, label: "0-5s" },
      { min: 5, max: 10, label: "5-10s" },
      { min: 10, max: 20, label: "10-20s" },
      { min: 20, max: 30, label: "20-30s" },
      { min: 30, max: Number.POSITIVE_INFINITY, label: "30s+" },
    ]

    const timeDistribution: AnalyticsData["timeDistribution"] = timeRanges.map((range) => {
      const count = sessions.reduce((sum: number, session: PrismaSession) => {
        const avgTimePerQ = session.answers.length > 0 ? session.duration / session.answers.length : 0
        return sum + (avgTimePerQ >= range.min && avgTimePerQ < range.max ? 1 : 0)
      }, 0)
      return {
        timeRange: range.label,
        count,
      }
    })

    // Generate suggestions
    const suggestions = this.generateSuggestions(topicPerformance, averageScore, averageAccuracy)

    return {
      overallStats: {
        totalSessions,
        averageScore: Math.round(averageScore),
        averageAccuracy: Math.round(averageAccuracy * 100),
        totalQuestionsAnswered,
        averageTimePerQuestion: Math.round(averageTimePerQuestion / 1000), // Convert to seconds
      },
      recentSessions,
      topicPerformance,
      progressOverTime,
      timeDistribution,
      suggestions,
    }
  }

  private static generateSuggestions(
    topicPerformance: AnalyticsData["topicPerformance"],
    averageScore: number,
    averageAccuracy: number,
  ): string[] {
    const suggestions: string[] = []

    // Find weakest topic
    const weakestTopic =
      topicPerformance.length > 0
        ? topicPerformance.reduce((min, topic) =>
            topic.averageAccuracy < min.averageAccuracy ? topic : min,
          )
        : {
            topic: "GENERAL_KNOWLEDGE" as Topic,
            averageAccuracy: 1,
            totalQuestions: 0,
            correctAnswers: 0,
            averageTime: 0,
          }

    if (weakestTopic.averageAccuracy < 0.7) {
      suggestions.push(
        `Focus more on ${weakestTopic.topic.replace("_", " ")} - your accuracy is ${Math.round(
          weakestTopic.averageAccuracy * 100,
        )}%`,
      )
    }

    // Speed suggestions
    const avgTime =
      topicPerformance.length > 0
        ? topicPerformance.reduce((sum, t) => sum + t.averageTime, 0) / topicPerformance.length
        : 0
    if (avgTime > 10000) {
      // More than 10 seconds
      suggestions.push("Try practicing with shorter time limits to improve your speed")
    }

    // Overall performance suggestions
    if (averageScore < 60) {
      suggestions.push("Consider reviewing fundamental concepts before timed practice")
    } else if (averageScore > 80) {
      suggestions.push("Great job! Try harder time settings or mixed topic sessions")
    }

    // Consistency suggestions
    if (averageAccuracy < 0.6) {
      suggestions.push("Focus on accuracy over speed - take time to read questions carefully")
    }

    return suggestions.slice(0, 3) // Limit to 3 suggestions
  }

  private static getEmptyAnalytics(): AnalyticsData {
    return {
      overallStats: {
        totalSessions: 0,
        averageScore: 0,
        averageAccuracy: 0,
        totalQuestionsAnswered: 0,
        averageTimePerQuestion: 0,
      },
      recentSessions: [],
      topicPerformance: [],
      progressOverTime: [],
      timeDistribution: [],
      suggestions: ["Start practicing to see your analytics and get personalized suggestions!"],
    }
  }
}

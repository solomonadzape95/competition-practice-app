import { prisma } from "./prisma"
import { Topic } from "./types"
import type { Question, PracticeSessionConfig } from "./types"

export class QuestionService {
  static async getRandomQuestions(topics: Topic[], count = 30, difficulty?: string): Promise<Question[]> {
    // When STATISTICS is selected, also include DATA_ANALYSIS questions
    const expandedTopics = topics.flatMap(topic => {
      if (topic === "STATISTICS") {
        return ["STATISTICS", "DATA_ANALYSIS"]
      }
      return [topic]
    })

    const whereClause: any = {
      topic: {
        in: expandedTopics,
      },
    }

    if (difficulty) {
      whereClause.difficulty = difficulty
    }

    // Get total count for random sampling
    const totalQuestions = await prisma.question.count({
      where: whereClause,
    })

    if (totalQuestions === 0) {
      throw new Error("No questions found for the specified criteria")
    }

    // Get random questions by skipping random amounts
    const questions: Question[] = []
    const usedIds = new Set<string>()

    while (questions.length < Math.min(count, totalQuestions)) {
      const skip = Math.floor(Math.random() * totalQuestions)

      const question = await prisma.question.findFirst({
        where: {
          ...whereClause,
          id: {
            notIn: Array.from(usedIds),
          },
        },
        skip,
      })

      if (question && !usedIds.has(question.id)) {
        questions.push(question)
        usedIds.add(question.id)
      }
    }

    return this.shuffleArray(questions)
  }

  static async createPracticeSession(userId: string, config: PracticeSessionConfig) {
    // When STATISTICS is selected, store both STATISTICS and DATA_ANALYSIS
    const dbTopics = config.topics.flatMap(topic => {
      if (topic === "STATISTICS") {
        return ["STATISTICS", "DATA_ANALYSIS"]
      }
      return [topic]
    })

    const session = await prisma.practiceSession.create({
      data: {
        userId,
        topics: dbTopics,
        timeLimit: config.timeLimit,
        score: 0,
        accuracy: 0,
        duration: 0,
      },
    })

    return session
  }

  static async submitAnswer(sessionId: string, questionId: string, selectedAnswer: string, timeTaken: number) {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    })

    if (!question) {
      throw new Error("Question not found")
    }

    const isCorrect = selectedAnswer === question.correctAnswer

    const answer = await prisma.answer.create({
      data: {
        practiceSessionId: sessionId,
        questionId,
        chosenAnswer: selectedAnswer,
        isCorrect,
        timeTaken,
      },
    })

    return { answer, isCorrect }
  }

  static async finalizePracticeSession(sessionId: string, duration: number) {
    const answers = await prisma.answer.findMany({
      where: { practiceSessionId: sessionId },
      include: { question: true },
    })

    const totalQuestions = answers.length
    const correctAnswers = answers.filter((a: { isCorrect: any }) => a.isCorrect).length
    const score = Math.round((correctAnswers / totalQuestions) * 100)
    const accuracy = correctAnswers / totalQuestions

    // Update session with final results
    const updatedSession = await prisma.practiceSession.update({
      where: { id: sessionId },
      data: {
        score,
        accuracy,
        duration,
      },
    })

    // Calculate topic breakdown (merge STATISTICS and DATA_ANALYSIS)
    const topicBreakdown: Record<string, { correct: number; total: number }> = {}

    answers.forEach((answer: { question: { topic: any }; isCorrect: any }) => {
      let topic = answer.question.topic
      // Merge STATISTICS and DATA_ANALYSIS into STATISTICS for display
      if (topic === "STATISTICS" || topic === "DATA_ANALYSIS") {
        topic = "STATISTICS"
      }
      
      if (!topicBreakdown[topic]) {
        topicBreakdown[topic] = { correct: 0, total: 0 }
      }
      topicBreakdown[topic].total++
      if (answer.isCorrect) {
        topicBreakdown[topic].correct++
      }
    })

    return {
      sessionId,
      score,
      accuracy,
      duration,
      totalQuestions,
      correctAnswers,
      topicBreakdown,
    }
  }

  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  static getTopicDisplayName(topic: Topic): string {
    const displayNames: Record<Topic, string> = {
      STATISTICS: "Statistics & Data Analysis",
      DATA_ANALYSIS: "Statistics & Data Analysis", 
      GENERAL_KNOWLEDGE: "General Knowledge",
      VERBAL_REASONING: "Verbal Reasoning",
      APPLIED_MATH: "Applied Math",
    }
    return displayNames[topic]
  }
}

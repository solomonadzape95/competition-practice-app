export type Topic = "STATISTICS" | "DATA_ANALYSIS" | "GENERAL_KNOWLEDGE" | "VERBAL_REASONING" | "APPLIED_MATH"
export type Difficulty = "EASY" | "MEDIUM" | "HARD"

export interface Question {
  id: string
  topic: Topic
  text: string
  options: string[]
  correctAnswer: string
  difficulty: Difficulty
}

export interface PracticeSessionConfig {
  topics: Topic[]
  timeLimit: number // seconds per question
  questionCount: number
}

export interface SessionQuestion extends Question {
  timeRemaining: number
  answered: boolean
  selectedAnswer?: string
}

export interface SessionResult {
  sessionId: string
  score: number
  accuracy: number
  duration: number
  totalQuestions: number
  correctAnswers: number
  topicBreakdown: Record<Topic, { correct: number; total: number }>
}

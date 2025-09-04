import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { QuestionService } from "@/lib/question-service"
import type { PracticeSessionConfig } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const config: PracticeSessionConfig = await request.json()

    // Validate config
    if (!config.topics || config.topics.length === 0) {
      return NextResponse.json({ error: "At least one topic is required" }, { status: 400 })
    }

    if (!config.timeLimit || config.timeLimit < 1) {
      return NextResponse.json({ error: "Valid time limit is required" }, { status: 400 })
    }

    // Create practice session
    const practiceSession = await QuestionService.createPracticeSession(session.user.id, config)

    // Get questions for the session
    const questions = await QuestionService.getRandomQuestions(config.topics, config.questionCount || 30)

    return NextResponse.json({
      sessionId: practiceSession.id,
      questions: questions.map((q) => ({
        id: q.id,
        topic: q.topic,
        text: q.text,
        options: q.options,
        // Don't send correct answer to client
      })),
      config,
    })
  } catch (error) {
    console.error("Error starting practice session:", error)
    return NextResponse.json({ error: "Failed to start practice session" }, { status: 500 })
  }
}

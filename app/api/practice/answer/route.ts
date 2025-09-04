import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { QuestionService } from "@/lib/question-service"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId, questionId, selectedAnswer, timeTaken } = await request.json()

    // Allow empty string for selectedAnswer to represent a timeout/no answer
    if (!sessionId || !questionId || selectedAnswer === undefined || timeTaken === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await QuestionService.submitAnswer(sessionId, questionId, selectedAnswer, timeTaken)

    return NextResponse.json({
      isCorrect: result.isCorrect,
      answerId: result.answer.id,
    })
  } catch (error) {
    console.error("Error submitting answer:", error)
    return NextResponse.json({ error: "Failed to submit answer" }, { status: 500 })
  }
}

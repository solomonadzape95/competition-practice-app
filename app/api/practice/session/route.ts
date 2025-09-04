import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { QuestionService } from "@/lib/question-service"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // Get the practice session
    const practiceSession = await prisma.practiceSession.findUnique({
      where: { id: sessionId },
    })

    if (!practiceSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Verify the session belongs to the user
    if (practiceSession.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get questions for the session topics
    const questions = await QuestionService.getRandomQuestions(
      practiceSession.topics as any,
      practiceSession.timeLimit ? 30 : 30 // Default to 30 questions
    )

    return NextResponse.json({
      session: practiceSession,
      questions: questions.map((q) => ({
        id: q.id,
        topic: q.topic,
        text: q.text,
        options: q.options,
        // Don't send correct answer to client
      })),
      timeLimit: practiceSession.timeLimit,
    })
  } catch (error) {
    console.error("Error fetching session data:", error)
    return NextResponse.json({ error: "Failed to fetch session data" }, { status: 500 })
  }
}

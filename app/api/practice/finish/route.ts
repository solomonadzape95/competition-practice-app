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

    const { sessionId, duration } = await request.json()

    if (!sessionId || duration === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const results = await QuestionService.finalizePracticeSession(sessionId, duration)

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Error finishing practice session:", error)
    return NextResponse.json({ error: "Failed to finish practice session" }, { status: 500 })
  }
}

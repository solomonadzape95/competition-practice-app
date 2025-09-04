import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { QuestionService } from "@/lib/question-service"
import type { Topic } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const topicsParam = searchParams.get("topics")
    const count = Number.parseInt(searchParams.get("count") || "30")
    const difficulty = searchParams.get("difficulty") || undefined

    if (!topicsParam) {
      return NextResponse.json({ error: "Topics parameter is required" }, { status: 400 })
    }

    const topics = topicsParam.split(",") as Topic[]

    const questions = await QuestionService.getRandomQuestions(topics, count, difficulty)

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
  }
}

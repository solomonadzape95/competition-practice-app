import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// External Questions API (see API.md)
const BASE_URL = process.env.QUESTIONS_API_URL || "http://127.0.0.1:8000"

type ExternalCategory = "applied_math" | "statistics" | "verbal_reasoning" | "general_knowledge"

interface ExternalQuestionResponse {
  category: string
  questions: Array<{
    question: string
    options: string[]
    answer: string
  }>
}

const categoryMap: Record<ExternalCategory, { topic: "APPLIED_MATH" | "STATISTICS" | "VERBAL_REASONING" | "GENERAL_KNOWLEDGE" }> = {
  applied_math: { topic: "APPLIED_MATH" },
  statistics: { topic: "STATISTICS" },
  verbal_reasoning: { topic: "VERBAL_REASONING" },
  general_knowledge: { topic: "GENERAL_KNOWLEDGE" },
}

export async function POST(request: NextRequest) {
  try {
    // Public endpoint: no authentication required

    const { category, count } = (await request.json().catch(() => ({}))) as {
      category?: ExternalCategory
      count?: number
    }

    if (!category || !(category in categoryMap)) {
      return NextResponse.json({ error: "Invalid or missing category" }, { status: 400 })
    }

    const requested = Math.min(Math.max(count ?? 25, 1), 100)

    const res = await fetch(`${BASE_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, num_questions: requested }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`Question generation failed for ${category}:`, text)
      return NextResponse.json({ error: `Upstream generation failed for ${category}` }, { status: 502 })
    }

    const data = (await res.json()) as ExternalQuestionResponse
    const toCreate: Array<{ topic: string; text: string; options: string[]; correctAnswer: string; difficulty: "EASY" | "MEDIUM" | "HARD" }> = []

    for (const q of data.questions) {
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4) continue
      const idx = q.options.findIndex((opt) => opt.trim() === q.answer?.trim())
      if (idx < 0 || idx > 3) continue
      const letter = String.fromCharCode(65 + idx) as "A" | "B" | "C" | "D"
      toCreate.push({
        topic: categoryMap[category].topic,
        text: q.question.trim(),
        options: q.options.map((o) => o.trim()),
        correctAnswer: letter,
        difficulty: "MEDIUM",
      })
    }

    let created = 0
    if (toCreate.length > 0) {
      const createRes = await prisma.question.createMany({ data: toCreate })
      created = createRes.count
    }

    return NextResponse.json({ ok: true, category, requested, created, skipped: Math.max(0, requested - created) })
  } catch (error) {
    console.error("Error generating/seeding questions:", error)
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 })
  }
}




"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { QuestionDisplay } from "@/components/practice/question-display"
import { SessionResults } from "@/components/practice/session-results"
import { usePracticeSession } from "@/hooks/use-practice-session"
import { Brain } from "lucide-react"
import type { SessionQuestion } from "@/lib/types"

export default function PracticePage() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("sessionId")
  const ttsFromUrl = searchParams.get("tts") === "true"

  const [questions, setQuestions] = useState<SessionQuestion[]>([])
  const [timeLimit, setTimeLimit] = useState(8)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const practiceSession = usePracticeSession({
    sessionId: sessionId || "",
    questions,
    timeLimit,
  })

  useEffect(() => {
    if (!sessionId || status !== "authenticated") return

    const fetchSessionData = async () => {
      try {
        const response = await fetch(`/api/practice/session?sessionId=${sessionId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch session data")
        }

        const data = await response.json()
        setQuestions(
          data.questions.map((q: any) => ({
            ...q,
            timeRemaining: data.timeLimit,
            answered: false,
          })),
        )
        setTimeLimit(data.timeLimit)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setIsLoading(false)
      }
    }

    fetchSessionData()
  }, [sessionId, status])

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Brain className="w-8 h-8 animate-pulse mx-auto text-primary" />
          <p className="text-muted-foreground">Loading practice session...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Please sign in to access practice sessions</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">Error: {error}</p>
        </div>
      </div>
    )
  }

  if (!sessionId || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No practice session found</p>
        </div>
      </div>
    )
  }

  if (practiceSession.isFinished && practiceSession.results) {
    return <SessionResults results={practiceSession.results} />
  }

  if (!practiceSession.currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Brain className="w-8 h-8 animate-pulse mx-auto text-primary" />
          <p className="text-muted-foreground">Preparing questions...</p>
        </div>
      </div>
    )
  }

  return (
    <QuestionDisplay
      question={practiceSession.currentQuestion}
      questionNumber={practiceSession.currentQuestionIndex + 1}
      totalQuestions={practiceSession.totalQuestions}
      timeRemaining={practiceSession.timeRemaining}
      onAnswerSelect={practiceSession.handleAnswerSelect}
      progress={practiceSession.progress}
    />
  )
}

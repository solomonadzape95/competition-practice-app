"use client"

import { useState, useEffect, useCallback } from "react"
import type { SessionQuestion, SessionResult } from "@/lib/types"

interface UsePracticeSessionProps {
  sessionId: string
  questions: SessionQuestion[]
  timeLimit: number // seconds per question
}

export function usePracticeSession({ sessionId, questions, timeLimit }: UsePracticeSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [sessionStartTime] = useState(Date.now())
  const [isFinished, setIsFinished] = useState(false)
  const [results, setResults] = useState<SessionResult | null>(null)

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  // Timer effect
  useEffect(() => {
    if (isFinished || !currentQuestion) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up, move to next question
          handleTimeUp()
          return timeLimit
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestionIndex, isFinished, timeLimit])

  const handleTimeUp = useCallback(async () => {
    if (!currentQuestion) return

    // Submit empty answer for timeout
    await submitAnswer("")

    if (isLastQuestion) {
      await finishSession()
    } else {
      setCurrentQuestionIndex((prev) => prev + 1)
      setTimeRemaining(timeLimit)
    }
  }, [currentQuestion, isLastQuestion, timeLimit])

  const submitAnswer = async (selectedAnswer: string) => {
    if (!currentQuestion) return

    const timeTaken = (timeLimit - timeRemaining) * 1000 // Convert to milliseconds

    try {
      const response = await fetch("/api/practice/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          questionId: currentQuestion.id,
          selectedAnswer,
          timeTaken,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit answer")
      }

      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: selectedAnswer,
      }))
    } catch (error) {
      console.error("Error submitting answer:", error)
    }
  }

  const handleAnswerSelect = async (selectedAnswer: string) => {
    if (!currentQuestion || isFinished) return

    await submitAnswer(selectedAnswer)

    if (isLastQuestion) {
      await finishSession()
    } else {
      setCurrentQuestionIndex((prev) => prev + 1)
      setTimeRemaining(timeLimit)
    }
  }

  const finishSession = async () => {
    const duration = Math.floor((Date.now() - sessionStartTime) / 1000)

    try {
      const response = await fetch("/api/practice/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          duration,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to finish session")
      }

      const data = await response.json()
      setResults(data.results)
      setIsFinished(true)
    } catch (error) {
      console.error("Error finishing session:", error)
    }
  }

  return {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions: questions.length,
    timeRemaining,
    isFinished,
    results,
    handleAnswerSelect,
    progress: ((currentQuestionIndex + 1) / questions.length) * 100,
  }
}

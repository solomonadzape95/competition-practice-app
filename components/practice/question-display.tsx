"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TTSControls } from "./tts-controls"
import { useTextToSpeech } from "@/hooks/use-text-to-speech"
import type { SessionQuestion } from "@/lib/types"

interface QuestionDisplayProps {
  question: SessionQuestion
  questionNumber: number
  totalQuestions: number
  timeRemaining: number
  onAnswerSelect: (answer: string) => void
  progress: number
}

export function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  timeRemaining,
  onAnswerSelect,
  progress,
}: QuestionDisplayProps) {
  const [ttsEnabled, setTtsEnabled] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [volume, setVolume] = useState(0.8)

  const tts = useTextToSpeech({
    enabled: ttsEnabled,
    rate,
    pitch,
    volume,
    voice: selectedVoice,
  })

  useEffect(() => {
    if (ttsEnabled && question && tts.isSupported) {
      // Small delay to ensure the question is rendered
      const timer = setTimeout(() => {
        const questionText = `Question ${questionNumber}. ${question.text}. Option A: ${question.options[0]}. Option B: ${question.options[1]}. Option C: ${question.options[2]}. Option D: ${question.options[3]}.`
        tts.speak(questionText)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [question, questionNumber, ttsEnabled, tts])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()

      // Answer selection shortcuts
      if (["a", "b", "c", "d"].includes(key)) {
        event.preventDefault()
        onAnswerSelect(key.toUpperCase())
        return
      }

      // TTS shortcuts
      if (event.ctrlKey || event.metaKey) {
        switch (key) {
          case "t":
            event.preventDefault()
            setTtsEnabled(!ttsEnabled)
            break
          case " ":
            event.preventDefault()
            if (tts.isSpeaking) {
              tts.pause()
            } else {
              handleSpeakQuestion()
            }
            break
          case "s":
            event.preventDefault()
            tts.stop()
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [onAnswerSelect, ttsEnabled, tts])

  const handleSpeakQuestion = () => {
    const questionText = `Question ${questionNumber}. ${question.text}. Option A: ${question.options[0]}. Option B: ${question.options[1]}. Option C: ${question.options[2]}. Option D: ${question.options[3]}.`
    tts.speak(questionText)
  }

  const formatTime = (seconds: number) => {
    return `${seconds}s`
  }

  const getTimeColor = (seconds: number) => {
    if (seconds <= 1) return "text-destructive"
    if (seconds <= 3) return "text-yellow-500"
    return "text-muted-foreground"
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Question {questionNumber} of {totalQuestions}
            </span>
            {tts.isSupported && (
              <TTSControls
                isEnabled={ttsEnabled}
                onToggle={setTtsEnabled}
                isSpeaking={tts.isSpeaking}
                onSpeak={handleSpeakQuestion}
                onStop={tts.stop}
                onPause={tts.pause}
                onResume={tts.resume}
                voices={tts.voices}
                selectedVoice={selectedVoice}
                onVoiceChange={setSelectedVoice}
                rate={rate}
                onRateChange={setRate}
                pitch={pitch}
                onPitchChange={setPitch}
                volume={volume}
                onVolumeChange={setVolume}
              />
            )}
          </div>
          <span className={`text-4xl font-mono font-bold ${getTimeColor(timeRemaining)}`}>
            {formatTime(timeRemaining)}
          </span>
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      {/* Question Card */}
      <Card className="w-full max-w-4xl p-8 border-0 shadow-none bg-card">
        <div className="text-center space-y-8">
          {/* Topic Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {question.topic.replace("_", " ")}
          </div>

          {/* Question Text */}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-relaxed text-balance">
            {question.text}
          </h1>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {question.options.map((option, index) => {
              const letter = String.fromCharCode(65 + index) // A, B, C, D
              return (
                <Button
                  key={letter}
                  variant="outline"
                  size="lg"
                  className="h-auto p-4 text-left justify-start hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 bg-transparent min-h-[80px]"
                  onClick={() => onAnswerSelect(letter)}
                >
                  <span className="flex items-start gap-4 w-full">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm mt-1">
                      {letter}
                    </span>
                    <span className="text-base leading-relaxed break-words max-w-full">{option}</span>
                  </span>
                </Button>
              )
            })}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Press <kbd className="px-2 py-1 bg-muted rounded text-xs">A</kbd>,{" "}
              <kbd className="px-2 py-1 bg-muted rounded text-xs">B</kbd>,{" "}
              <kbd className="px-2 py-1 bg-muted rounded text-xs">C</kbd>, or{" "}
              <kbd className="px-2 py-1 bg-muted rounded text-xs">D</kbd> to select your answer
            </p>
            {tts.isSupported && (
              <p className="text-xs text-muted-foreground">
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+T</kbd> toggle speech,{" "}
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+Space</kbd> play/pause,{" "}
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+S</kbd> stop
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

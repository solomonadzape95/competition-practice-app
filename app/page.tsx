"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Play, Settings, BarChart3, Brain, Volume2 } from "lucide-react"
import Link from "next/link"
import type { Topic } from "@/lib/types"

const TOPICS: { value: Topic; label: string; description: string }[] = [
  { value: "STATISTICS", label: "Statistics", description: "Mean, median, distributions, hypothesis testing" },
  { value: "DATA_ANALYSIS", label: "Data Analysis", description: "Charts, correlations, data cleaning" },
  { value: "APPLIED_MATH", label: "Applied Math", description: "Calculus, algebra, mathematical functions" },
  { value: "VERBAL_REASONING", label: "Verbal Reasoning", description: "Vocabulary, analogies, comprehension" },
  { value: "GENERAL_KNOWLEDGE", label: "General Knowledge", description: "Science, history, current events" },
]

const TIME_LIMITS = [
  { value: 3, label: "3 seconds", description: "Lightning fast" },
  { value: 8, label: "8 seconds", description: "Standard pace" },
  { value: 15, label: "15 seconds", description: "Relaxed" },
  { value: 30, label: "30 seconds", description: "No pressure" },
]

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([])
  const [timeLimit, setTimeLimit] = useState(8)
  const [isStarting, setIsStarting] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(false)

  const handleTopicToggle = (topic: Topic) => {
    setSelectedTopics((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]))
  }

  const handleMixedTopics = () => {
    setSelectedTopics(TOPICS.map((t) => t.value))
  }

  const handleStartPractice = async () => {
    if (selectedTopics.length === 0) return

    setIsStarting(true)
    try {
      const response = await fetch("/api/practice/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topics: selectedTopics,
          timeLimit,
          questionCount: 30,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to start practice session")
      }

      const data = await response.json()
      const url = new URL(`/practice`, window.location.origin)
      url.searchParams.set("sessionId", data.sessionId)
      if (ttsEnabled) {
        url.searchParams.set("tts", "true")
      }
      router.push(url.toString())
    } catch (error) {
      console.error("Error starting practice:", error)
      setIsStarting(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Brain className="w-8 h-8 animate-pulse mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <Brain className="w-16 h-16 mx-auto text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Competition Practice</h1>
            <p className="text-muted-foreground text-balance">
              Sharpen your skills with timed practice sessions across multiple topics
            </p>
          </div>

          <div className="space-y-4">
            <Button asChild size="lg" className="w-full">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full bg-transparent" asChild>
              <Link href="/auth/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header handled by Navbar */}

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Ready to Practice?</h1>
            <p className="text-xl text-muted-foreground text-balance">
              Choose your topics and time limit to start a focused practice session
            </p>
          </div>

          {/* Topic Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Select Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedTopics.length === TOPICS.length ? "default" : "outline"}
                  size="sm"
                  onClick={handleMixedTopics}
                >
                  Mixed (All Topics)
                </Button>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TOPICS.map((topic) => (
                  <div
                    key={topic.value}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedTopics.includes(topic.value)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleTopicToggle(topic.value)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{topic.label}</h3>
                        <p className="text-sm text-muted-foreground">{topic.description}</p>
                      </div>
                      {selectedTopics.includes(topic.value) && (
                        <Badge variant="default" className="ml-2">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Time Limit Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Time Limit per Question</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {TIME_LIMITS.map((limit) => (
                  <Button
                    key={limit.value}
                    variant={timeLimit === limit.value ? "default" : "outline"}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => setTimeLimit(limit.value)}
                  >
                    <span className="text-lg font-bold">{limit.label}</span>
                    <span className="text-xs text-muted-foreground">{limit.description}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Accessibility Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="tts-toggle" className="text-base font-medium">
                    Text-to-Speech
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Have questions read aloud automatically during practice
                  </p>
                </div>
                <Switch id="tts-toggle" checked={ttsEnabled} onCheckedChange={setTtsEnabled} />
              </div>
            </CardContent>
          </Card>

          {/* Start Button */}
          <div className="text-center">
            <Button
              size="lg"
              className="px-8 py-6 text-lg"
              onClick={handleStartPractice}
              disabled={selectedTopics.length === 0 || isStarting}
            >
              <Play className="w-5 h-5 mr-2" />
              {isStarting ? "Starting..." : "Start Practice Session"}
            </Button>
            {selectedTopics.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">Please select at least one topic to continue</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

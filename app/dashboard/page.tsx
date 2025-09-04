"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { OverviewCards } from "@/components/dashboard/overview-cards"
import { ProgressChart } from "@/components/dashboard/progress-chart"
import { TopicPerformance } from "@/components/dashboard/topic-performance"
import { RecentSessions } from "@/components/dashboard/recent-sessions"
import { Suggestions } from "@/components/dashboard/suggestions"
import { Brain, Play, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { AnalyticsData } from "@/lib/analytics-service"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      fetchAnalytics()
    }
  }, [status, router])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics")
      if (!response.ok) {
        throw new Error("Failed to fetch analytics")
      }
      const data = await response.json()
      setAnalytics(data.analytics)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Brain className="w-8 h-8 animate-pulse mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">Error: {error}</p>
          <Button onClick={fetchAnalytics}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No analytics data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header handled by Navbar */}

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {session?.user?.name || "Student"}!</h1>
          <p className="text-muted-foreground">Here's your performance overview and insights to help you improve.</p>
        </div>

        {/* Overview Cards */}
        <OverviewCards stats={analytics.overallStats} />

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProgressChart data={analytics.progressOverTime} />
          <div className="space-y-6">
            <RecentSessions sessions={analytics.recentSessions} />
            <Suggestions suggestions={analytics.suggestions} />
          </div>
        </div>

        {/* Topic Performance */}
        <TopicPerformance data={analytics.topicPerformance} />
      </main>
    </div>
  )
}

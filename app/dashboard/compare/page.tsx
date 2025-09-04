"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartRadarCompare } from "@/components/dashboard/radar-compare"

export default function ComparePage() {
  const { status } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any | null>(null)

  const handleCompare = async () => {
    setIsLoading(true)
    setError(null)
    setData(null)
    try {
      const res = await fetch(`/api/analytics/compare?email=${encodeURIComponent(email)}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to compare")
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to compare")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Compare Performance</h1>
        <p className="text-muted-foreground">Search a user's email to compare analytics.</p>
      </div>

      <div className="flex gap-3 max-w-md">
        <Input
          type="email"
          placeholder="friend@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleCompare} disabled={!email || isLoading}>
          {isLoading ? "Comparing..." : "Compare"}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Overview</CardTitle>
              <CardDescription>Sessions: {data.self.overallStats.totalSessions}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div>Avg Score: {data.self.overallStats.averageScore}</div>
              <div>Avg Accuracy: {data.self.overallStats.averageAccuracy}%</div>
              <div>Total Answered: {data.self.overallStats.totalQuestionsAnswered}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Other User Overview</CardTitle>
              <CardDescription>Sessions: {data.other.overallStats.totalSessions}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div>Avg Score: {data.other.overallStats.averageScore}</div>
              <div>Avg Accuracy: {data.other.overallStats.averageAccuracy}%</div>
              <div>Total Answered: {data.other.overallStats.totalQuestionsAnswered}</div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <ChartRadarCompare selfData={data.self.topicPerformance} otherData={data.other.topicPerformance} />
          </div>
        </div>
      )}
    </div>
  )
}



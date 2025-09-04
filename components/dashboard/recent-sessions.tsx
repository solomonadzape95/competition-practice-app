import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Target } from "lucide-react"
import type { AnalyticsData } from "@/lib/analytics-service"

interface RecentSessionsProps {
  sessions: AnalyticsData["recentSessions"]
}

export function RecentSessions({ sessions }: RecentSessionsProps) {
  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">No recent sessions. Start practicing to see your session history.</div>
        </CardContent>
      </Card>
    )
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${getScoreColor(session.score)}`}>{session.score}%</span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Target className="w-3 h-3" />
                    {Math.round(session.accuracy * 100)}%
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatDuration(session.duration)}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {session.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">{new Date(session.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

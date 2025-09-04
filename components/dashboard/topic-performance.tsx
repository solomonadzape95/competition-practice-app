"use client"

import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { AnalyticsData } from "@/lib/analytics-service"

interface TopicPerformanceProps {
  data: AnalyticsData["topicPerformance"]
}

export function TopicPerformance({ data }: TopicPerformanceProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Topic Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            No topic data available. Complete some practice sessions to see your performance by topic.
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map((topic) => ({
    topic: topic.topic.replace("_", " "),
    accuracy: Math.round(topic.averageAccuracy * 100),
    questions: topic.totalQuestions,
  }))

  return (
    <div className="space-y-6">
      {/* Detailed Topic Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Topic Strengths & Weaknesses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data
            .sort((a, b) => b.averageAccuracy - a.averageAccuracy)
            .map((topic) => {
              const accuracy = Math.round(topic.averageAccuracy * 100)
              const getAccuracyColor = (acc: number) => {
                if (acc >= 80) return "text-green-500"
                if (acc >= 60) return "text-yellow-500"
                return "text-red-500"
              }

              return (
                <div key={topic.topic} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{topic.topic.replace("_", " ")}</span>
                    <div className="text-right">
                      <span className={`font-bold ${getAccuracyColor(accuracy)}`}>{accuracy}%</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({topic.correctAnswers}/{topic.totalQuestions})
                      </span>
                    </div>
                  </div>
                  <Progress value={accuracy} className="h-2" />
                </div>
              )
            })}
        </CardContent>
      </Card>

      {/* Topic Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Accuracy by Topic</CardTitle>
          <CardDescription>How you perform across topics</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ accuracy: { label: "Accuracy", color: "var(--chart-1)" } }}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="topic"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="accuracy" fill="var(--color-accuracy)" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Improving steadily <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">Based on recent sessions</div>
        </CardFooter>
      </Card>
    </div>
  )
}

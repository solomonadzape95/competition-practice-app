"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { AnalyticsData } from "@/lib/analytics-service"

interface RadarCompareProps {
  selfData: AnalyticsData["topicPerformance"]
  otherData: AnalyticsData["topicPerformance"]
}

export function ChartRadarCompare({ selfData, otherData }: RadarCompareProps) {
  // Build a topic union and map to accuracy percentage for both users
  const topics = Array.from(
    new Set([
      ...selfData.map((t) => t.topic),
      ...otherData.map((t) => t.topic),
    ]),
  )

  const byTopic = (arr: RadarCompareProps["selfData"]) =>
    Object.fromEntries(arr.map((t) => [t.topic, Math.round(t.averageAccuracy * 100)]))

  const selfMap = byTopic(selfData)
  const otherMap = byTopic(otherData)

  const shortLabel = (t: string) => {
    const pretty = t.replace(/_/g, " ")
    // Abbreviate to avoid clipping on small screens
    if (pretty.length <= 12) return pretty
    const parts = pretty.split(" ")
    return parts.map((p) => (p.length > 6 ? p.slice(0, 6) : p)).join(" ")
  }

  const chartData = topics.map((topic) => ({
    topic,
    label: shortLabel(topic),
    self: selfMap[topic as keyof typeof selfMap] ?? 0,
    other: otherMap[topic as keyof typeof otherMap] ?? 0,
  }))

  const chartConfig = {
    self: { label: "You", color: "var(--chart-1)" },
    other: { label: "Other", color: "var(--chart-2)" },
  } as const

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Topic Accuracy Comparison</CardTitle>
        <CardDescription>Compare accuracy by topic</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[500px]">
          <RadarChart data={chartData} outerRadius="85%" margin={{ top: 32, right: 32, bottom: 32, left: 32 }}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <PolarAngleAxis dataKey="label" tick={{ fontSize: 12 }} />
            <PolarGrid radialLines={false} />
            <Radar
              dataKey="self"
              fill="var(--color-self)"
              fillOpacity={0}
              stroke="var(--color-self)"
              strokeWidth={2}
            />
            <Radar
              dataKey="other"
              fill="var(--color-other)"
              fillOpacity={0}
              stroke="var(--color-other)"
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          See strengths vs peers <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground flex items-center gap-2 leading-none">
          Based on recent sessions
        </div>
      </CardFooter>
    </Card>
  )
}



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"
import type { AnalyticsData } from "@/lib/analytics-service"

interface SuggestionsProps {
  suggestions: AnalyticsData["suggestions"]
}

export function Suggestions({ suggestions }: SuggestionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Personalized Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p className="text-sm">{suggestion}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

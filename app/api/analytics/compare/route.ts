import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { AnalyticsService } from "@/lib/analytics-service"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Find the other user by email
    const otherUser = await prisma.user.findUnique({ where: { email } })
    if (!otherUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const [selfAnalytics, otherAnalytics] = await Promise.all([
      AnalyticsService.getUserAnalytics(session.user.id),
      AnalyticsService.getUserAnalytics(otherUser.id),
    ])

    return NextResponse.json({ self: selfAnalytics, other: otherAnalytics })
  } catch (error) {
    console.error("Error comparing analytics:", error)
    return NextResponse.json({ error: "Failed to compare analytics" }, { status: 500 })
  }
}



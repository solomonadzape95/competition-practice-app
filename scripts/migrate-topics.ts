import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function migrateTopics() {
  console.log("🔄 Starting topic migration...")

  try {
    // Update STATISTICS questions to STATISTICS_AND_DATA
    const statsResult = await prisma.question.updateMany({
      where: { topic: "STATISTICS" as any },
      data: { topic: "STATISTICS_AND_DATA" as any },
    })
    console.log(`✅ Updated ${statsResult.count} STATISTICS questions to STATISTICS_AND_DATA`)

    // Update DATA_ANALYSIS questions to STATISTICS_AND_DATA
    const dataResult = await prisma.question.updateMany({
      where: { topic: "DATA_ANALYSIS" as any },
      data: { topic: "STATISTICS_AND_DATA" as any },
    })
    console.log(`✅ Updated ${dataResult.count} DATA_ANALYSIS questions to STATISTICS_AND_DATA`)

    // Update practice sessions that reference old topics
    const sessionsResult = await prisma.practiceSession.updateMany({
      where: {
        topics: {
          hasSome: ["STATISTICS", "DATA_ANALYSIS"] as any,
        },
      },
      data: {
        topics: {
          set: ["STATISTICS_AND_DATA", "GENERAL_KNOWLEDGE", "VERBAL_REASONING", "APPLIED_MATH"] as any,
        },
      },
    })
    console.log(`✅ Updated ${sessionsResult.count} practice sessions`)

    console.log("🎉 Topic migration completed successfully!")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the migration
migrateTopics()
  .then(() => {
    console.log("✅ Migration completed!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("💥 Migration failed:", error)
    process.exit(1)
  })

import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

const sampleQuestions = [
  // Statistics Questions
  {
    topic: "STATISTICS" as const,
    text: "What is the mean of the dataset: 2, 4, 6, 8, 10?",
    options: ["4", "5", "6", "7"],
    correctAnswer: "C",
    difficulty: "EASY" as const,
  },
  {
    topic: "STATISTICS" as const,
    text: "In a normal distribution, what percentage of data falls within one standard deviation of the mean?",
    options: ["68%", "95%", "99.7%", "50%"],
    correctAnswer: "A",
    difficulty: "MEDIUM" as const,
  },
  {
    topic: "STATISTICS" as const,
    text: "What is the median of: 1, 3, 5, 7, 9, 11?",
    options: ["5", "6", "7", "8"],
    correctAnswer: "B",
    difficulty: "EASY" as const,
  },
  {
    topic: "STATISTICS" as const,
    text: "What does a p-value of 0.03 indicate in hypothesis testing?",
    options: ["Accept null hypothesis", "Reject null hypothesis at α=0.05", "Inconclusive result", "Need more data"],
    correctAnswer: "B",
    difficulty: "HARD" as const,
  },

  // Data Analysis Questions
  {
    topic: "DATA_ANALYSIS" as const,
    text: "Which chart type is best for showing trends over time?",
    options: ["Pie chart", "Bar chart", "Line chart", "Scatter plot"],
    correctAnswer: "C",
    difficulty: "EASY" as const,
  },
  {
    topic: "DATA_ANALYSIS" as const,
    text: "What does a correlation coefficient of -0.8 indicate?",
    options: ["Strong positive correlation", "Strong negative correlation", "Weak correlation", "No correlation"],
    correctAnswer: "B",
    difficulty: "MEDIUM" as const,
  },
  {
    topic: "DATA_ANALYSIS" as const,
    text: "In data cleaning, what is the best approach for handling missing values in a time series?",
    options: [
      "Delete all rows with missing values",
      "Replace with mean",
      "Forward fill or interpolation",
      "Replace with zero",
    ],
    correctAnswer: "C",
    difficulty: "HARD" as const,
  },

  // Applied Math Questions
  {
    topic: "APPLIED_MATH" as const,
    text: "If f(x) = 2x + 3, what is f(5)?",
    options: ["10", "11", "13", "15"],
    correctAnswer: "C",
    difficulty: "EASY" as const,
  },
  {
    topic: "APPLIED_MATH" as const,
    text: "What is the derivative of x²?",
    options: ["x", "2x", "2", "x²"],
    correctAnswer: "B",
    difficulty: "MEDIUM" as const,
  },
  {
    topic: "APPLIED_MATH" as const,
    text: "What is the integral of cos(x) dx?",
    options: ["sin(x) + C", "-sin(x) + C", "cos(x) + C", "-cos(x) + C"],
    correctAnswer: "A",
    difficulty: "HARD" as const,
  },

  // Verbal Reasoning Questions
  {
    topic: "VERBAL_REASONING" as const,
    text: "Choose the word that best completes: 'The evidence was _____ and could not be disputed.'",
    options: ["ambiguous", "conclusive", "preliminary", "theoretical"],
    correctAnswer: "B",
    difficulty: "MEDIUM" as const,
  },
  {
    topic: "VERBAL_REASONING" as const,
    text: "What is the antonym of 'abundant'?",
    options: ["plentiful", "scarce", "numerous", "ample"],
    correctAnswer: "B",
    difficulty: "EASY" as const,
  },
  {
    topic: "VERBAL_REASONING" as const,
    text: "If 'perspicacious' means having keen insight, what does 'obtuse' mean in this context?",
    options: ["Sharp", "Intelligent", "Dull or slow to understand", "Quick-witted"],
    correctAnswer: "C",
    difficulty: "HARD" as const,
  },

  // General Knowledge Questions
  {
    topic: "GENERAL_KNOWLEDGE" as const,
    text: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correctAnswer: "C",
    difficulty: "EASY" as const,
  },
  {
    topic: "GENERAL_KNOWLEDGE" as const,
    text: "Which element has the chemical symbol 'Au'?",
    options: ["Silver", "Gold", "Aluminum", "Argon"],
    correctAnswer: "B",
    difficulty: "MEDIUM" as const,
  },
  {
    topic: "GENERAL_KNOWLEDGE" as const,
    text: "Who developed the theory of general relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Niels Bohr"],
    correctAnswer: "B",
    difficulty: "EASY" as const,
  },
  {
    topic: "GENERAL_KNOWLEDGE" as const,
    text: "What is the smallest unit of matter that retains the properties of an element?",
    options: ["Molecule", "Atom", "Proton", "Electron"],
    correctAnswer: "B",
    difficulty: "MEDIUM" as const,
  },
]

async function seedQuestions() {
  console.log("🌱 Seeding questions...")

  try {
    // Clear existing questions
    await prisma.question.deleteMany()
    console.log("Cleared existing questions")

    // Insert sample questions
    for (const question of sampleQuestions) {
      await prisma.question.create({
        data: question,
      })
    }

    console.log(`✅ Successfully seeded ${sampleQuestions.length} questions`)
  } catch (error) {
    console.error("❌ Error seeding questions:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed function
seedQuestions()
  .then(() => {
    console.log("🎉 Database seeding completed!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("💥 Database seeding failed:", error)
    process.exit(1)
  })

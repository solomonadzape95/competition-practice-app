"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var sampleQuestions = [
    // Statistics Questions
    {
        topic: "STATISTICS",
        text: "What is the mean of the dataset: 2, 4, 6, 8, 10?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "C",
        difficulty: "EASY",
    },
    {
        topic: "STATISTICS",
        text: "In a normal distribution, what percentage of data falls within one standard deviation of the mean?",
        options: ["68%", "95%", "99.7%", "50%"],
        correctAnswer: "A",
        difficulty: "MEDIUM",
    },
    {
        topic: "STATISTICS",
        text: "What is the median of: 1, 3, 5, 7, 9, 11?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "B",
        difficulty: "EASY",
    },
    {
        topic: "STATISTICS",
        text: "What does a p-value of 0.03 indicate in hypothesis testing?",
        options: ["Accept null hypothesis", "Reject null hypothesis at α=0.05", "Inconclusive result", "Need more data"],
        correctAnswer: "B",
        difficulty: "HARD",
    },
    // Data Analysis Questions
    {
        topic: "DATA_ANALYSIS",
        text: "Which chart type is best for showing trends over time?",
        options: ["Pie chart", "Bar chart", "Line chart", "Scatter plot"],
        correctAnswer: "C",
        difficulty: "EASY",
    },
    {
        topic: "DATA_ANALYSIS",
        text: "What does a correlation coefficient of -0.8 indicate?",
        options: ["Strong positive correlation", "Strong negative correlation", "Weak correlation", "No correlation"],
        correctAnswer: "B",
        difficulty: "MEDIUM",
    },
    {
        topic: "DATA_ANALYSIS",
        text: "In data cleaning, what is the best approach for handling missing values in a time series?",
        options: [
            "Delete all rows with missing values",
            "Replace with mean",
            "Forward fill or interpolation",
            "Replace with zero",
        ],
        correctAnswer: "C",
        difficulty: "HARD",
    },
    // Applied Math Questions
    {
        topic: "APPLIED_MATH",
        text: "If f(x) = 2x + 3, what is f(5)?",
        options: ["10", "11", "13", "15"],
        correctAnswer: "C",
        difficulty: "EASY",
    },
    {
        topic: "APPLIED_MATH",
        text: "What is the derivative of x²?",
        options: ["x", "2x", "2", "x²"],
        correctAnswer: "B",
        difficulty: "MEDIUM",
    },
    {
        topic: "APPLIED_MATH",
        text: "What is the integral of cos(x) dx?",
        options: ["sin(x) + C", "-sin(x) + C", "cos(x) + C", "-cos(x) + C"],
        correctAnswer: "A",
        difficulty: "HARD",
    },
    // Verbal Reasoning Questions
    {
        topic: "VERBAL_REASONING",
        text: "Choose the word that best completes: 'The evidence was _____ and could not be disputed.'",
        options: ["ambiguous", "conclusive", "preliminary", "theoretical"],
        correctAnswer: "B",
        difficulty: "MEDIUM",
    },
    {
        topic: "VERBAL_REASONING",
        text: "What is the antonym of 'abundant'?",
        options: ["plentiful", "scarce", "numerous", "ample"],
        correctAnswer: "B",
        difficulty: "EASY",
    },
    {
        topic: "VERBAL_REASONING",
        text: "If 'perspicacious' means having keen insight, what does 'obtuse' mean in this context?",
        options: ["Sharp", "Intelligent", "Dull or slow to understand", "Quick-witted"],
        correctAnswer: "C",
        difficulty: "HARD",
    },
    // General Knowledge Questions
    {
        topic: "GENERAL_KNOWLEDGE",
        text: "What is the capital of Australia?",
        options: ["Sydney", "Melbourne", "Canberra", "Perth"],
        correctAnswer: "C",
        difficulty: "EASY",
    },
    {
        topic: "GENERAL_KNOWLEDGE",
        text: "Which element has the chemical symbol 'Au'?",
        options: ["Silver", "Gold", "Aluminum", "Argon"],
        correctAnswer: "B",
        difficulty: "MEDIUM",
    },
    {
        topic: "GENERAL_KNOWLEDGE",
        text: "Who developed the theory of general relativity?",
        options: ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Niels Bohr"],
        correctAnswer: "B",
        difficulty: "EASY",
    },
    {
        topic: "GENERAL_KNOWLEDGE",
        text: "What is the smallest unit of matter that retains the properties of an element?",
        options: ["Molecule", "Atom", "Proton", "Electron"],
        correctAnswer: "B",
        difficulty: "MEDIUM",
    },
];
function seedQuestions() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, sampleQuestions_1, question, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🌱 Seeding questions...");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, 8, 10]);
                    // Clear existing questions
                    return [4 /*yield*/, prisma.question.deleteMany()];
                case 2:
                    // Clear existing questions
                    _a.sent();
                    console.log("Cleared existing questions");
                    _i = 0, sampleQuestions_1 = sampleQuestions;
                    _a.label = 3;
                case 3:
                    if (!(_i < sampleQuestions_1.length)) return [3 /*break*/, 6];
                    question = sampleQuestions_1[_i];
                    return [4 /*yield*/, prisma.question.create({
                            data: question,
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    console.log("\u2705 Successfully seeded ".concat(sampleQuestions.length, " questions"));
                    return [3 /*break*/, 10];
                case 7:
                    error_1 = _a.sent();
                    console.error("❌ Error seeding questions:", error_1);
                    throw error_1;
                case 8: return [4 /*yield*/, prisma.$disconnect()];
                case 9:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
// Run the seed function
seedQuestions()
    .then(function () {
    console.log("🎉 Database seeding completed!");
    process.exit(0);
})
    .catch(function (error) {
    console.error("💥 Database seeding failed:", error);
    process.exit(1);
});

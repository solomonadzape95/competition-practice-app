-- Sample questions for testing the practice system
-- This script will be converted to Prisma operations in the next task

-- Statistics Questions
INSERT INTO Question (topic, text, options, correctAnswer, difficulty) VALUES
('STATISTICS', 'What is the mean of the dataset: 2, 4, 6, 8, 10?', ['4', '5', '6', '7'], 'C', 'EASY'),
('STATISTICS', 'In a normal distribution, what percentage of data falls within one standard deviation of the mean?', ['68%', '95%', '99.7%', '50%'], 'A', 'MEDIUM'),
('STATISTICS', 'What is the median of: 1, 3, 5, 7, 9, 11?', ['5', '6', '7', '8'], 'B', 'EASY');

-- Data Analysis Questions  
INSERT INTO Question (topic, text, options, correctAnswer, difficulty) VALUES
('DATA_ANALYSIS', 'Which chart type is best for showing trends over time?', ['Pie chart', 'Bar chart', 'Line chart', 'Scatter plot'], 'C', 'EASY'),
('DATA_ANALYSIS', 'What does a correlation coefficient of -0.8 indicate?', ['Strong positive correlation', 'Strong negative correlation', 'Weak correlation', 'No correlation'], 'B', 'MEDIUM');

-- Applied Math Questions
INSERT INTO Question (topic, text, options, correctAnswer, difficulty) VALUES
('APPLIED_MATH', 'If f(x) = 2x + 3, what is f(5)?', ['10', '11', '13', '15'], 'C', 'EASY'),
('APPLIED_MATH', 'What is the derivative of x²?', ['x', '2x', '2', 'x²'], 'B', 'MEDIUM');

-- Verbal Reasoning Questions
INSERT INTO Question (topic, text, options, correctAnswer, difficulty) VALUES
('VERBAL_REASONING', 'Choose the word that best completes: "The evidence was _____ and could not be disputed."', ['ambiguous', 'conclusive', 'preliminary', 'theoretical'], 'B', 'MEDIUM'),
('VERBAL_REASONING', 'What is the antonym of "abundant"?', ['plentiful', 'scarce', 'numerous', 'ample'], 'B', 'EASY');

-- General Knowledge Questions
INSERT INTO Question (topic, text, options, correctAnswer, difficulty) VALUES
('GENERAL_KNOWLEDGE', 'What is the capital of Australia?', ['Sydney', 'Melbourne', 'Canberra', 'Perth'], 'C', 'EASY'),
('GENERAL_KNOWLEDGE', 'Which element has the chemical symbol "Au"?', ['Silver', 'Gold', 'Aluminum', 'Argon'], 'B', 'MEDIUM');

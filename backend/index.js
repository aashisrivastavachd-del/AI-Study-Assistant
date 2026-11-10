const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "AI Study Assistant backend is running!",
  });
});

// AI Tutor route
app.post("/api/ask", async (req, res) => {
  const { question } = req.body;

  console.log("Question received:", question);

  if (!question || !question.trim()) {
    return res.status(400).json({
      error: "Please enter a question.",
    });
  }

  try {
    const response = await ai.interactions.create({
  model: "gemini-3.6-flash",
  input: `You are an AI Study Assistant for college students.

Your job is to help students understand academic concepts clearly and prepare for exams.

Follow these rules:
- Start with a simple definition.
- Explain the important points in an easy-to-understand way.
- Give a simple example when appropriate.
- Use headings or bullet points when they make the answer clearer.
- For programming questions, use C++ unless the student specifies another language.
- End with a short "Exam Tip" when appropriate.
- Avoid unnecessarily complicated language.
- Keep the answer reasonably concise unless the student asks for a detailed explanation.

Student's question:
${question}`,
});

    res.json({
      answer: response.output_text,
    });
  } catch (error) {
    console.error("Gemini error:", error);

    res.status(500).json({
      error: "Failed to get a response from Gemini.",
    });
  }
});

// AI Summarizer route
app.post("/api/summarize", async (req, res) => {
  const { notes } = req.body;

  console.log("Notes received for summarization");

  if (!notes || !notes.trim()) {
    return res.status(400).json({
      error: "Please provide some notes to summarize.",
    });
  }

  try {
    const response = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: `You are an AI study assistant.

Summarize the following study notes for a college student.

Rules:
- Give 3 to 5 important points.
- Use simple language.
- Keep the important facts and concepts.
- Remove unnecessary repetition.
- Make the summary easy to revise before an exam.

Study notes:
${notes}`,
    });

    res.json({
      summary: response.output_text,
    });
  } catch (error) {
    console.error("Gemini summarizer error:", error);

    res.status(500).json({
      error: "Failed to summarize the notes.",
    });
  }
});

// AI Flashcards route
app.post("/api/flashcards", async (req, res) => {
  const { notes } = req.body;

  console.log("Notes received for flashcards");

  if (!notes || !notes.trim()) {
    return res.status(400).json({
      error: "Please provide some notes.",
    });
  }

  try {
    const response = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: `You are an AI study assistant.

Create exactly 5 flashcards from the following study notes.

Rules:
- Each flashcard must have one question and one answer.
- Questions should test important concepts.
- Answers should be short, clear and easy to remember.
- Use simple language.
- Cover different important points.
- Do not add information that is not present in the notes.

Format:

Flashcard 1
Q: [Question]
A: [Answer]

Flashcard 2
Q: [Question]
A: [Answer]

Continue until Flashcard 5.

Study Notes:
${notes}`,
    });

    res.json({
      flashcards: response.output_text,
    });

  } catch (error) {
    console.error("Gemini flashcards error:", error);

    res.status(500).json({
      error: "Failed to generate flashcards.",
    });
  }
});

// AI MCQ Quiz route
app.post("/api/quiz", async (req, res) => {
  const { notes } = req.body;

  if (!notes || !notes.trim()) {
    return res.status(400).json({
      error: "Please provide study notes."
    });
  }

  try {
    const response = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: `Create exactly 3 multiple-choice questions from these study notes.

Rules:
- Each question must have exactly 4 options.
- Only one option must be correct.
- Include a short explanation for each correct answer.
- Do not use information outside the notes.
- Return ONLY valid JSON. Do not use markdown or code fences.

Use this exact JSON format:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Short explanation"
  }
]

Study notes:
${notes}`
    });

    const cleanText = response.output_text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const quiz = JSON.parse(cleanText);

    res.json({ quiz });

  } catch (error) {
    console.error("Gemini quiz error:", error);

    res.status(500).json({
      error: "Failed to generate the quiz."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
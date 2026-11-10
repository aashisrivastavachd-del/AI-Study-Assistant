
import { useState } from "react";
import "../App.css";

function Quiz() {
  const [notes, setNotes] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateQuiz = async () => {
    if (!notes.trim()) {
      setError("Please enter your study notes first.");
      return;
    }

    setLoading(true);
    setError("");
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);

    try {
      const response = await fetch("http://localhost:5000/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not generate quiz.");
      }

      if (!Array.isArray(data.quiz) || data.quiz.length !== 3) {
        throw new Error("The quiz response was not in the expected format.");
      }

      setQuestions(data.quiz);
    } catch (error) {
      console.error(error);
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = () => {
    return questions.filter(
      (question, index) =>
        answers[index] === question.correctAnswer
    ).length;
  };

  return (
    <div className="tutor-page">
      <nav className="navbar">
        <div className="logo">
          Study<span>AI</span>
        </div>

        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/tutor">AI Tutor</a>
          <a href="/summarizer">Summarizer</a>
          <a href="/flashcards">Flashcards</a>
        </div>

        <div className="tutor-badge">✦ MCQ Quiz</div>
      </nav>

      <main className="tutor-main">
        <div className="tutor-header">
          <div className="tutor-icon">✦</div>

          <p className="small-heading">TEST YOUR KNOWLEDGE</p>

          <h1>
            Learn. Practice. <span>Improve.</span>
          </h1>

          <p>
            Generate a quick three-question quiz from your study notes.
          </p>
        </div>

        <div className="question-box">
          <textarea
            placeholder="Paste your study notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="question-footer">
            <span>✦ 3 AI-generated questions</span>

            <button onClick={generateQuiz} disabled={loading}>
              {loading ? "Generating..." : "Generate Quiz ✦"}
            </button>
          </div>
        </div>

        {error && (
          <p style={{ color: "#dc2626", textAlign: "center", marginTop: 20 }}>
            {error}
          </p>
        )}

        {questions.length > 0 && (
          <section style={{ marginTop: 35 }}>
            <h2 style={{ textAlign: "center", color: "#211b35" }}>
              📝 Your MCQ Quiz
            </h2>

            {questions.map((question, index) => (
              <div
                key={index}
                style={{
                  background: "#fff",
                  border: "1px solid #e8e1ff",
                  borderRadius: 16,
                  padding: 22,
                  marginTop: 20,
                  boxShadow: "0 8px 25px rgba(90,60,150,0.07)",
                }}
              >
                <p style={{ color: "#7547ff", fontWeight: 700 }}>
                  QUESTION {index + 1} OF 3
                </p>

                <h3 style={{ color: "#211b35", margin: "12px 0 18px" }}>
                  {question.question}
                </h3>

                {question.options.map((option, optionIndex) => {
                  const isSelected = answers[index] === option;
                  const isCorrect = option === question.correctAnswer;

                  let background = "#fff";
                  let borderColor = "#e5e1ef";

                  if (submitted && isCorrect) {
                    background = "#e8f8ed";
                    borderColor = "#25a45a";
                  } else if (submitted && isSelected && !isCorrect) {
                    background = "#fff0f0";
                    borderColor = "#dc2626";
                  } else if (isSelected) {
                    background = "#f2edff";
                    borderColor = "#7547ff";
                  }

                  return (
                    <button
                      key={optionIndex}
                      disabled={submitted}
                      onClick={() =>
                        setAnswers((previous) => ({
                          ...previous,
                          [index]: option,
                        }))
                      }
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: 14,
                        marginBottom: 10,
                        borderRadius: 10,
                        border: `1px solid ${borderColor}`,
                        background,
                        color: "#333",
                        cursor: submitted ? "default" : "pointer",
                      }}
                    >
                      {String.fromCharCode(65 + optionIndex)}. {option}
                      {submitted && isCorrect && " ✓"}
                      {submitted && isSelected && !isCorrect && " ✗"}
                    </button>
                  );
                })}

                {submitted && (
                  <div style={{ marginTop: 15, color: "#444" }}>
                    <p>
                      <strong>Correct Answer:</strong> {question.correctAnswer}
                    </p>
                    <p style={{ marginTop: 8 }}>
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {!submitted ? (
              <button
                onClick={() => setSubmitted(true)}
                disabled={Object.keys(answers).length !== 3}
                style={{
                  display: "block",
                  margin: "25px auto",
                  padding: "13px 30px",
                  border: "none",
                  borderRadius: 10,
                  background: "#7547ff",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Submit Quiz
              </button>
            ) : (
              <div style={{ textAlign: "center", marginTop: 30 }}>
                <h2 style={{ color: "#7547ff" }}>
                  Your Score: {calculateScore()} / 3
                </h2>

                <p style={{ marginTop: 10 }}>
                  {calculateScore() === 3
                    ? "Excellent work! 🎉"
                    : "Good effort! Keep practising. 💜"}
                </p>

                <button
                  onClick={generateQuiz}
                  style={{
                    marginTop: 20,
                    padding: "12px 25px",
                    background: "#7547ff",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    cursor: "pointer",
                  }}
                >
                  Try Another Quiz
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default Quiz;


import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

// Convert Gemini's text response into separate flashcards
function parseFlashcards(text) {
  const regex =
    /Flashcard\s*\d+\s*Q:\s*([\s\S]*?)\s*A:\s*([\s\S]*?)(?=Flashcard\s*\d+\s*Q:|$)/gi;

  const matches = [...text.matchAll(regex)];

  return matches.map((match, index) => ({
    id: index + 1,
    question: match[1].trim().replace(/\*\*/g, ""),
    answer: match[2].trim().replace(/\*\*/g, ""),
  }));
}

function Flashcards() {
  const [notes, setNotes] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState([]);

  const generateFlashcards = async () => {
    if (!notes.trim() || loading) {
      setError("Please enter your study notes first.");
      return;
    }

    setLoading(true);
    setFlashcards([]);
    setRevealed([]);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/flashcards",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notes }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      const parsedCards = parseFlashcards(data.flashcards || "");

      if (parsedCards.length === 0) {
        throw new Error("Could not format the flashcards. Please try again.");
      }

      setFlashcards(parsedCards);
    } catch (error) {
      console.error(error);
      setError(error.message || "Sorry, couldn't generate flashcards.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAnswer = (id) => {
    setRevealed((previous) =>
      previous.includes(id)
        ? previous.filter((cardId) => cardId !== id)
        : [...previous, id]
    );
  };

  const clearFlashcards = () => {
    setNotes("");
    setFlashcards([]);
    setRevealed([]);
    setError("");
  };

  return (
    <div className="tutor-page">

      {/* Navigation */}
      <nav className="navbar">
        <Link to="/" className="logo">
          Study<span>AI</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/tutor">AI Tutor</Link>
          <Link to="/summarizer">Summarizer</Link>
        </div>

        <div className="tutor-badge">
          ✦ Flashcards
        </div>
      </nav>

      {/* Main Area */}
      <main className="tutor-main">

        <div className="tutor-header">
          <div className="tutor-icon">✦</div>

          <p className="small-heading">
            ACTIVE RECALL
          </p>

          <h1>
            Turn notes into <span>flashcards.</span>
          </h1>

          <p>
            Paste your study notes and let AI create five
            useful question-and-answer flashcards.
          </p>
        </div>

        {/* Notes Input */}
        <div className="question-box">

          <textarea
            placeholder="Paste your study notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={loading}
          />

          <div className="question-footer">
            <span>{notes.length} characters</span>

            <button
              onClick={generateFlashcards}
              disabled={loading || !notes.trim()}
            >
              {loading ? "Creating..." : "Create Flashcards ✦"}
            </button>
          </div>

        </div>

        {/* Error Message */}
        {error && (
          <p className="flashcard-error">
            {error}
          </p>
        )}

        {/* Loading Message */}
        {loading && (
          <div className="ai-answer loading-box">
            <h3>✦ Creating your flashcards...</h3>
            <p>AI is preparing questions and answers from your notes.</p>
          </div>
        )}

        {/* Generated Flashcards */}
        {flashcards.length > 0 && !loading && (
          <section className="flashcards-section">

            <div className="flashcards-heading">
              <div>
                <h2>🃏 Your Flashcards</h2>
                <p>Click each card to reveal its answer.</p>
              </div>

              <button
                className="clear-btn"
                onClick={clearFlashcards}
              >
                Clear
              </button>
            </div>

            <div className="flashcard-progress">
              <span>
                Answers revealed: {revealed.length}/{flashcards.length}
              </span>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(revealed.length / flashcards.length) * 100}%`
                  }}
                />
              </div>
            </div>

            <div className="flashcards-grid">

              {flashcards.map((card) => (
                <div className="flashcard-card" key={card.id}>

                  <div>
                    <p className="flashcard-number">
                      FLASHCARD {card.id}
                    </p>

                    <h3 className="flashcard-question">
                      {card.question}
                    </h3>

                    {revealed.includes(card.id) && (
                      <div className="flashcard-answer">
                        <p className="answer-label">ANSWER</p>
                        <p>{card.answer}</p>
                      </div>
                    )}
                  </div>

                  <button
                    className={
                      revealed.includes(card.id)
                        ? "flashcard-button revealed"
                        : "flashcard-button"
                    }
                    onClick={() => toggleAnswer(card.id)}
                  >
                    {revealed.includes(card.id)
                      ? "Hide Answer ↑"
                      : "Show Answer ↓"}
                  </button>

                </div>
              ))}

            </div>
          </section>
        )}

      </main>
    </div>
  );
}

export default Flashcards;

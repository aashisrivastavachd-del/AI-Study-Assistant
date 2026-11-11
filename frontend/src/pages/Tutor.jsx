import API_BASE_URL from "../api";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";


function formatAnswer(text) {
  const lines = text.split("\n");

  return lines.map((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return <div key={index} className="answer-space" />;
    }

    // Main headings
    if (trimmed.startsWith("## ")) {
      return <h2 key={index}>{trimmed.replace(/^##\s*/, "")}</h2>;
    }

    // Smaller headings
    if (trimmed.startsWith("### ")) {
      return <h3 key={index}>{trimmed.replace(/^###\s*/, "")}</h3>;
    }

    // Bullet points
    if (/^[-*]\s/.test(trimmed)) {
      return (
        <div key={index} className="answer-list-item">
          <span>•</span>
          <div>{formatBold(trimmed.replace(/^[-*]\s+/, ""))}</div>
        </div>
      );
    }

    // Numbered points
    if (/^\d+[.)]\s/.test(trimmed)) {
      const match = trimmed.match(/^(\d+[.)])\s+(.*)$/);

      return (
        <div key={index} className="answer-list-item">
          <strong>{match[1]}</strong>
          <div>{formatBold(match[2])}</div>
        </div>
      );
    }

    return <p key={index}>{formatBold(trimmed)}</p>;
  });
}

function formatBold(text) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}


function Tutor() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim() || loading) return;

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setAnswer(data.answer);
    } catch (error) {
      console.error(error);
      setAnswer("Sorry, I couldn't connect to the AI tutor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setQuestion("");
    setAnswer("");
  };

  const handleSuggestion = (text) => {
    setQuestion(text);
    setAnswer("");
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
          <Link to="/#features">Features</Link>
        </div>

        <div className="tutor-badge">
          ✦ AI Tutor
        </div>
      </nav>

      {/* Main Tutor Area */}
      <main className="tutor-main">

        <div className="tutor-header">
          <div className="tutor-icon">
            ✦
          </div>

          <p className="small-heading">
            YOUR AI STUDY COMPANION
          </p>

          <h1>
            What would you like to <span>learn?</span>
          </h1>

          <p>
            Ask questions about any subject and get simple,
            easy-to-understand explanations powered by AI.
          </p>
        </div>

        {/* Question Box */}
        <div className="question-box">

          <textarea
            placeholder="Example: Explain recursion in simple terms..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                askAI();
              }
            }}
            disabled={loading}
          />

          <div className="question-footer">
            <span>
              ✦ AI-powered explanation
            </span>

            <button
              onClick={askAI}
              disabled={loading || !question.trim()}
            >
              {loading ? "Thinking..." : "Ask AI ✦"}
            </button>
          </div>
        </div>

        {/* Loading Message */}
        {loading && (
          <div className="ai-answer loading-box">
            <h3>✦ StudyAI is thinking...</h3>
            <p>Please wait while your explanation is being generated.</p>
          </div>
        )}

        {/* AI Answer */}
        {answer && !loading && (
          <div className="ai-answer">
            <div className="answer-heading">
              <h3>✦ AI Tutor Response</h3>

              <button
                className="clear-btn"
                onClick={clearChat}
              >
                Clear
              </button>
            </div>

            <div className="answer-text">
  {formatAnswer(answer)}
</div>
          </div>
        )}

        {/* Suggested Questions */}
        <div className="suggestions">
          <p>Not sure what to ask? Try these:</p>

          <div className="suggestion-list">
            <button
              onClick={() => handleSuggestion("Explain Binary Search Trees")}
            >
              Explain Binary Search Trees
            </button>

            <button
              onClick={() => handleSuggestion("What is recursion?")}
            >
              What is recursion?
            </button>

            <button
              onClick={() => handleSuggestion("Explain arrays vs linked lists")}
            >
              Explain arrays vs linked lists
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Tutor;

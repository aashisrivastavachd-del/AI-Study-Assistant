import API_BASE_URL from "../api";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

// Format Gemini's Markdown response
function formatSummary(text) {
  return text.split("\n").map((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return <div key={index} className="answer-space" />;
    }

    // Main headings
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={index}>
          {trimmed.replace(/^##\s*/, "")}
        </h2>
      );
    }

    // Subheadings
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={index}>
          {trimmed.replace(/^###\s*/, "")}
        </h3>
      );
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

// Format bold keywords
function formatBold(text) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}

function Summarizer() {
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const summarizeNotes = async () => {
    if (!notes.trim() || loading) return;

    setLoading(true);
    setSummary("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSummary(data.summary);
    } catch (error) {
      console.error(error);
      setSummary("Sorry, I couldn't summarize the notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearNotes = () => {
    setNotes("");
    setSummary("");
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
        </div>

        <div className="tutor-badge">
          ✦ AI Summarizer
        </div>
      </nav>

      {/* Main Area */}
      <main className="tutor-main">

        <div className="tutor-header">
          <div className="tutor-icon">✦</div>

          <p className="small-heading">
            STUDY SMARTER
          </p>

          <h1>
            Summarize your <span>notes.</span>
          </h1>

          <p>
            Paste your study notes and let AI turn them into
            simple, easy-to-revise points.
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
            <span>
              {notes.length} characters
            </span>

            <button
              onClick={summarizeNotes}
              disabled={loading || !notes.trim()}
            >
              {loading ? "Summarizing..." : "Summarize ✦"}
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="ai-answer loading-box">
            <h3>✦ Creating your summary...</h3>
            <p>Please wait while AI simplifies your notes.</p>
          </div>
        )}

        {/* Generated Summary */}
        {summary && !loading && (
          <div className="ai-answer summary-result">

            <div className="answer-heading">
              <h3>📌 Your Study Summary</h3>

              <button
                className="clear-btn"
                onClick={clearNotes}
              >
                Clear
              </button>
            </div>

            <div className="answer-text">
              {formatSummary(summary)}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default Summarizer;


import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Tutor from "./pages/Tutor";
import Summarizer from "./pages/Summarizer";
import Flashcards from "./pages/Flashcards";
import Quiz from "./pages/Quiz";
import "./App.css";

function Home() {
  return (
    <div className="app">

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
          Study<span>AI</span>
        </div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <Link to="/tutor" className="login-btn">
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <p className="small-heading">
            AI-POWERED LEARNING
          </p>

          <h1>
            Learn Smarter.
            <br />
            <span>Study Better.</span>
          </h1>

          <p className="hero-text">
            Your personal AI study companion that helps you understand
            concepts, summarize notes, create flashcards and test your
            knowledge with quizzes.
          </p>

          <Link to="/tutor" className="primary-btn">
            Start Studying →
          </Link>
        </div>

        <div className="hero-card">
          <div className="ai-icon">✦</div>

          <h3>AI Study Assistant</h3>

          <p>
            Ask questions, summarize notes and learn at your own pace.
          </p>

          <div className="mini-card">
            <span>✦</span>
            <div>
              <strong>AI Tutor</strong>
              <small>Get explanations for your questions</small>
            </div>
          </div>

          <div className="mini-card">
            <span>✓</span>
            <div>
              <strong>Smart Quiz</strong>
              <small>Test your knowledge instantly</small>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <p className="small-heading">
          WHAT YOU CAN DO
        </p>

        <h2>
          Everything you need to study smarter.
        </h2>

        <div className="feature-grid">

          {/* AI Tutor */}
          <Link to="/tutor" className="feature-card">
            <div className="feature-icon">✦</div>
            <h3>AI Tutor</h3>
            <p>
              Ask questions and get simple explanations from AI.
            </p>
            <strong>Explore Tutor →</strong>
          </Link>

          {/* Summarizer */}
          <Link to="/summarizer" className="feature-card">
            <div className="feature-icon">▤</div>
            <h3>AI Summarizer</h3>
            <p>
              Convert lengthy study notes into short and easy summaries.
            </p>
            <strong>Summarize Notes →</strong>
          </Link>

          {/* Flashcards */}
          <Link to="/flashcards" className="feature-card">
            <div className="feature-icon">▣</div>
            <h3>AI Flashcards</h3>
            <p>
              Generate flashcards to remember important concepts.
            </p>
            <strong>Create Flashcards →</strong>
          </Link>

          {/* Quiz */}
          <Link to="/quiz" className="feature-card">
            <div className="feature-icon">?</div>
            <h3>AI Quiz Generator</h3>
            <p>
              Generate multiple-choice questions and check your score.
            </p>
            <strong>Take a Quiz →</strong>
          </Link>

        </div>
      </section>

      {/* About Section */}
      <section className="features" id="about">
        <p className="small-heading">ABOUT STUDYAI</p>

        <h2>Your personal AI-powered learning companion.</h2>

        <p className="hero-text">
          StudyAI uses artificial intelligence to make learning easier.
          It helps students understand difficult topics, prepare notes,
          practice concepts and check their knowledge in one place.
        </p>
      </section>

      {/* Footer */}
      <footer>
        <p>
          © 2026 StudyAI • AI-Powered Study Assistant
        </p>
      </footer>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tutor" element={<Tutor />} />
        <Route path="/summarizer" element={<Summarizer />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@/styles/TracksPage.css";
import { fetchQuizzes } from "@/api/quizApi";

const COMPANY_INFO = {
  "FAANG Companies": {
    overview: "Top-tier tech companies known for rigorous interviews and high-impact products.",
  },
  Infosys: { overview: "Infosys is a global consulting and IT services company." },
  Wipro: { overview: "Wipro provides IT services and consulting." },
  // add more as needed
};

export default function CompanyDetails() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState("overview");

  useEffect(() => {
    let mounted = true;
    fetchQuizzes()
      .then((data) => {
        if (!mounted) return;
        const n = String(name).toLowerCase();
        const matches = data.filter((q) => String(q.title || "").toLowerCase().includes(n));
        setQuizzes(matches);
      })
      .catch(() => {
        if (mounted) setQuizzes([]);
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [name]);

  const info = COMPANY_INFO[name] || { overview: `Quizzes and learning paths for ${name}.` };

  // helper to count questions per difficulty for this company
  const countsByDifficulty = (difficulty) => {
    // For simplicity: request each quiz's details to count questions by difficulty
    // (We'll derive counts from quizzes list by fetching details on the fly or show static 10)
    return 10; // show 10 as per requirement
  };

  return (
    <div className="company-details">
      {step !== 'overview' && <button className="back" onClick={() => setStep('overview')}>← Back to Company</button>}

      <div className="company-header">
        <h1>{name}</h1>
        <p className="muted">{info.overview}</p>
        <div className="company-cta">
          <button className="primary-btn" onClick={() => navigate(`/student/quiz?track=${encodeURIComponent(name)}`)}>View All Quizzes</button>
          <button className="secondary-btn" style={{marginLeft:8}} onClick={() => setStep('levels')}>Aptitude</button>
        </div>
      </div>

      {step === 'overview' && (
        <section style={{marginTop:20}}>
          <h3>Related Quizzes</h3>
          {loading ? (
            <p>Loading...</p>
          ) : quizzes.length === 0 ? (
            <p>No company-specific quizzes found. Try the general quiz list.</p>
          ) : (
            <div className="topics-grid">
              {quizzes.map((q) => (
                <div className="topic-card" key={q.id}>
                  <h3>{q.title}</h3>
                  <p>{q.desc || "Practice topic"}</p>
                  <div className="topic-meta">
                    {q.duration && <span className="meta-badge">⏱ {q.duration} mins</span>}
                    {q.level && <span className="meta-badge">⭐ {q.level}</span>}
                  </div>
                  <div className="topic-actions">
                    <button className="start-btn" onClick={() => navigate(`/student/quiz/${q.id}`)}>Start Quiz</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {step === 'levels' && (
        <>
          <button className="back" onClick={() => setStep('overview')}>← Back to Overview</button>
          <h2>{name}</h2>
          <h3>Aptitude</h3>

          <div className="levelGrid">
            {['Easy','Medium','Hard'].map(l => (
              <div key={l} className="levelCard">
                <span className={`badge ${l.toLowerCase()}`}>{l}</span>
                <h2>{countsByDifficulty(l)}</h2>
                <p>Questions</p>
                <button onClick={() => navigate(`/student/quiz/start?company=${encodeURIComponent(name)}&level=${l}`)}>Start Quiz</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
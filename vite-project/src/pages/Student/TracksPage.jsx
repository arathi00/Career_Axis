import "../../styles/TracksPage.css";
import { useNavigate } from "react-router-dom";
import React, { useMemo } from "react";

function TracksPage() {
  const navigate = useNavigate();

  const companyTracks = useMemo(() => [
    "Service Based Companies",
    "Product Based Companies",
    "FAANG Companies",
    "Big 4 Companies",
    "Data Science & Analytics",
    "TCS NQT",
    "TCS Ninja",
    "TCS Digital",
    "TCS Prime",
    "Wipro",
    "Cognizant",
    "TCS ITP",
    "IBM",
    "Tata Elexi",
    "Deloitte",
    "Accenture",
    "Persistent",
    "Infosys SP & DSE",
    "Reliance Jio",
    "ZS Associates",
    "Josh Technologies",
    "InfyTQ",
    "DXC",
    "HSBC",
    "Mindtree",
    "Mphasis",
    "Cognizant GenC Next",
    "Infosys",
    "Tech Mahindra",
    "Hexaware",
    "HCL",
    "LTI",
    "Capgemini"
  ], []);

  const departments = useMemo(() => [
    "CSE",
    "IT",
    "ECE",
    "EEE",
    "Mechanical",
    "Civil",
    "AI & DS",
    "Cyber Security"
  ], []);

  // helper: best score for a track/branch (reads attempts from localStorage)
  const bestScoreFor = (name) => {
    try {
      const attempts = JSON.parse(localStorage.getItem("quiz_attempts") || "[]");
      if (!attempts || attempts.length === 0) return null;
      const nameLower = name.toLowerCase();
      let best = null;
      attempts.forEach((a) => {
        if (!a.title) return;
        const title = String(a.title).toLowerCase();
        if (title.includes(nameLower) || (a.track && String(a.track).toLowerCase() === nameLower) || (a.category && String(a.category).toLowerCase() === nameLower)) {
          if (best === null || (a.percentage || 0) > best) best = a.percentage || 0;
        }
      });
      return best;
    } catch (err) {
      return null;
    }
  };

  return (
    <div className="tracks-container">
      <div className="tracks-hero">
        <div className="hero-text">
          <h1>Explore Assessments</h1>
          <p className="hero-quote">"Practice with targeted quizzes to level up your placement readiness."</p>          <div style={{marginTop:12}}>
            <button className="primary-btn" onClick={() => navigate('/student/quiz/scores')}>View My Scores</button>
          </div>        </div>
        <div className="hero-image">🎯</div>
      </div>

      <h2>Company Specific</h2>

      {/* Company Tracks */}
      <div className="track-section">
        <div className="track-grid">
          {companyTracks.map((track, index) => (
            <div
              key={index}
              className="track-card"
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/student/quiz?track=${encodeURIComponent(track)}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  navigate(`/student/quiz?track=${encodeURIComponent(track)}`);
              }}
            >
              <div className="track-thumb">🏢</div>
              <div className="track-title">{track}</div>
              <div className="track-cta">Explore Quizzes →</div>
            </div>
          ))}
        </div>
      </div>

      <h2>Aptitude & Branch Wise</h2>

      {/* Aptitude */}
      <div className="track-section">
        <div className="track-grid">
          {departments.map((dept, index) => (
            <div
              key={index}
              className="track-card aptitude"
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/student/quiz?track=${encodeURIComponent(dept)}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  navigate(`/student/quiz?track=${encodeURIComponent(dept)}`);
              }}
            >
              <div className="track-thumb">📚</div>
              <div className="track-title">{dept}</div>
              <div className="track-cta">Explore Quizzes →</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TracksPage;

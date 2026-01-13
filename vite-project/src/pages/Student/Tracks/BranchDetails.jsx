import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@/styles/TracksPage.css";

const BRANCH_INFO = {
  CSE: { overview: "Computer Science & Engineering — focus on algorithms, systems and programming." },
  IT: { overview: "Information Technology — software systems and applications." },
  ECE: { overview: "Electronics and Communications — embedded systems and signals." },
};

export default function BranchDetails(){
  const { dept } = useParams();
  const navigate = useNavigate();
  const info = BRANCH_INFO[dept] || { overview: `${dept} branch quizzes and aptitude practice.` };

  return (
    <div className="branch-details">
      <div className="company-header">
        <h1>{dept}</h1>
        <p className="muted">{info.overview}</p>
        <div className="company-cta">
          <button className="primary-btn" onClick={() => navigate(`/student/quiz?track=${encodeURIComponent(dept)}`)}>View Branch Quizzes</button>
        </div>
      </div>

      <section style={{marginTop:20}}>
        <h3>What to expect</h3>
        <ul>
          <li>Branch-specific aptitude and technical questions</li>
          <li>Time-bound quizzes and level tags</li>
          <li>Scores and performance history</li>
        </ul>
      </section>
    </div>
  );
}
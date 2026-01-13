import React from "react";
import "@/pages/Student/Assessment/assessment.css";

export default function CompanyCard({company, onView}){
  const totalQuestions = company.totalQuestions ?? company.quizzes.reduce((acc,q) => acc + (q.questions?.length || 0), 0);
  const abbr = company.abbreviation || company.name.substring(0, 3).toUpperCase();
  return (
    <div className="ass-company-card">
      <div className="card-header">
        <div className="logo-section">
          <div className="logo">{abbr}</div>
          <div>
            <h3>{company.name}</h3>
            <p className="question-count">📋 {totalQuestions} Questions</p>
          </div>
        </div>
      </div>
      <p className="muted descr">{company.overview}</p>
      <div className="category-badges">
        {company.tags.map((t,i) => (
          <button
            key={i}
            className="category-badge"
            onClick={() => onView && onView(company, t)}
            type="button"
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
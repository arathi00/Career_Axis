import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DifficultyCard from "@/components/Assessment/DifficultyCard";
import QuizSelection from "@/components/Assessment/QuizSelection";
import { companies, getQuestions } from "./assessmentData";
import "./assessment.css";

export default function CompanyAssessment(){
  const { name } = useParams();
  const navigate = useNavigate();
  const company = companies.find(c => c.name === name);
  if (!company) return <div style={{padding:24}}>Company not found</div>;

  // Get types from quizzes, fallback to tags
  let types = [...new Set(company.quizzes.map(q => q.type))].filter(Boolean).sort();
  if (types.length === 0 && company.tags) {
    types = [...company.tags].sort();
  }
  
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const qType = params.get('type');
  const initialType = qType && types.includes(qType) ? qType : (types[0] || 'Aptitude');
  const [type, setType] = useState(initialType);

  const totalQuestions = company.totalQuestions ?? company.quizzes.reduce((acc,q) => acc + (q.questions?.length || 0), 0);

  return (
    <div className="container">
      <button className="back" onClick={() => navigate('/student/assessments')}>← Back to Companies</button>
      <div className="company-header-section">
        <div className="company-logo-mini">{(company.abbreviation || company.name.substring(0,3)).toUpperCase()}</div>
        <div>
          <h1>{company.name}</h1>
          <p className="muted">Select a quiz type and difficulty level</p>
        </div>
      </div>

      {types && types.length > 0 ? (
        <>
          <div className="typeTabs">
            {types.map(t => {
              const count = getQuestions(company.id, t).length;
              return (
                <button key={t} className={`tab ${t===type? 'active' : ''}`} onClick={() => setType(t)}>
                  <span>{t}</span>
                </button>
              );
            })}
          </div>

          <QuizSelection company={company} type={type} onSelectQuiz={(quizType, level) => navigate(`/student/assessments/quiz?company=${encodeURIComponent(company.name)}&type=${encodeURIComponent(quizType)}&level=${encodeURIComponent(level)}`)} onBack={() => navigate('/student/assessments')} />
        </>
      ) : (
        <p style={{color:'#dc2626', padding:'20px'}}>No quizzes available for this company.</p>
      )}
    </div>
  );
}
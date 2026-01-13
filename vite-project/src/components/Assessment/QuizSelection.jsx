import React from "react";
import DifficultyCard from "./DifficultyCard";
import "@/pages/Student/Assessment/assessment.css";
import { getQuestions } from "@/pages/Student/Assessment/assessmentData";

export default function QuizSelection({ company, type='Aptitude', onSelectQuiz, onBack }){
  // derive counts using questions present for the given type
  const counts = {
    Easy: getQuestions(company.id, type, 'Easy').length,
    Medium: getQuestions(company.id, type, 'Medium').length,
    Hard: getQuestions(company.id, type, 'Hard').length,
  };

  return (
    <div className="quiz-selection-section">
      <div className="quiz-type-header">
        <span className="quiz-icon">⚙️</span>
        <div>
          <h3>{type}</h3>
          <p className="muted">Choose your difficulty level to start the quiz</p>
        </div>
      </div>

      <div className="levelGrid">
        {['Easy','Medium','Hard'].map(l => (
          <DifficultyCard
            key={l}
            level={l}
            count={counts[l]}
            examples={getQuestions(company.id, type, l).map(q => q.q)}
            onStart={(level) => onSelectQuiz(type, level)}
          />
        ))}
      </div>
    </div>
  );
}
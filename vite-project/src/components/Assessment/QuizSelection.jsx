import React from "react";
import DifficultyCard from "./DifficultyCard";
import "@/pages/Student/Assessment/assessment.css";

export default function QuizSelection({ company, type='Aptitude', difficulties=[], onSelectQuiz, onBack }){
  // difficulties is now passed from parent component with real data from API
  // Format: [{level: 'Easy', count: 50}, {level: 'Medium', count: 75}, {level: 'Hard', count: 25}]
  
  const difficultyMap = {};
  difficulties.forEach(d => {
    difficultyMap[d.level] = d.count || 0;
  });

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
            count={difficultyMap[l] || 0}
            examples={[]}
            onStart={(level) => onSelectQuiz(type, level)}
          />
        ))}
      </div>
    </div>
  );
}
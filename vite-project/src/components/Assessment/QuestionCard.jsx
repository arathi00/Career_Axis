import React from "react";
import "@/pages/Student/Assessment/assessment.css";

export default function QuestionCard({qIndex, item, selected, onSelect}){
  return (
    <div className="question-card">
      <div className="question-title-section">
        <div>
          <span className="question-category">{item.category || 'General'}</span>
          <span className="question-difficulty">easy</span>
        </div>
        <button className="bookmark-btn">🔖</button>
      </div>
      <h3 className="question-text">{item.q}</h3>
      <div className="options-list">
        {item.options.map((opt, i) => (
          <label key={i} className={`option-card ${selected===i ? 'selected' : ''}`}>
            <input 
              type="radio" 
              name={`question-${qIndex}`} 
              checked={selected===i}
              onChange={() => onSelect(i)}
            />
            <span className="option-text">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
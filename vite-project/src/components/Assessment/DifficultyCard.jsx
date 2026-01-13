import React, {useState} from "react";
import "@/pages/Student/Assessment/assessment.css";

export default function DifficultyCard({level, count, onStart, examples}){
  const [showExamples, setShowExamples] = useState(false);

  const defaultExamples = {
    Easy: [
      "What is 5 + 7?",
      "If x = 3, what is 2x + 4?",
      "Which number is largest: 3, 7, 5?"
    ],
    Medium: [
      "If 3x + 2 = 11, find x.",
      "What is the next number: 2, 4, 8, 16, ?",
      "Solve: (12 / 4) * (3 + 1)"
    ],
    Hard: [
      "If a train travels 60 km in 1.5 hours, what's its speed?",
      "Find x: 2x^2 - 3x - 2 = 0",
      "What is the probability of drawing an ace from a standard deck?"
    ]
  };

  const items = examples || defaultExamples[level] || [];

  return (
    <div className="levelCard">
      <span className={`badge ${level.toLowerCase()}`}>{level}</span>
      <h2>{count}</h2>
      <p>Questions</p>

      <div className="examplesWrap">
        <button
          className="linkBtn"
          onClick={() => setShowExamples(s => !s)}
          disabled={items.length === 0}
        >
          {showExamples ? "Hide Examples" : "View Example Questions"}
        </button>

        {showExamples && (
          <ul className="exampleList">
            {items.slice(0, 3).map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        )}
      </div>

      <button className="primary" onClick={() => onStart(level)} disabled={count === 0}>Start Quiz</button>
    </div>
  );
}
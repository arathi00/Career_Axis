import React from "react";
import "@/pages/Student/Assessment/assessment.css";

export default function ResultSummary({score, total}){
  const percentage = total ? Math.round((score/total)*100) : 0;
  return (
    <div className="resultGrid">
      <div className="ok">{score} <br/>Correct</div>
      <div className="bad">{total-score} <br/>Incorrect</div>
      <div className="total">{total} <br/>Total</div>
      <div className="percent">{percentage}% <br/>Score</div>
    </div>
  );
}
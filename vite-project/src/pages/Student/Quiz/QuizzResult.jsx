import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "@/styles/QuizStyles.css";

export default function QuizzResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const score = state?.score ?? state?.attempt?.score ?? 0;
  const total = state?.total ?? state?.attempt?.total ?? 0;
  const attempt = state?.attempt;
  const percentage = total ? Math.round((score / total) * 100) : (attempt?.percentage ?? 0);

  return (
    <div className="quiz-result">
      <h2>Quiz Completed!</h2>

      <div className="result-card">
        <h3>Your Score</h3>
        <h1>{score} / {total}</h1>
        <p>{percentage}% Accuracy</p>
      </div>

      {percentage < 60 ? (
        <p className="danger">Needs improvement. Study and try again.</p>
      ) : (
        <p className="success">Great job — keep practicing to improve further.</p>
      )}

      {attempt?.qa && (
        <section style={{marginTop:20}}>
          <h3>Review incorrect questions</h3>
          {attempt.qa.map((q, i) => {
            const selected = attempt.selectedAnswers ? attempt.selectedAnswers[i] : undefined;
            const correct = q.answer;
            const isCorrect = selected === correct;
            return (
              <div key={i} className={`review-card ${isCorrect ? 'correct' : 'wrong'}`} style={{marginBottom:12}}>
                <h4>Q{i+1}: {q.q}</h4>
                <p>Selected: {selected !== undefined ? q.options[selected] : 'No answer'}</p>
                <p>Correct: {q.options[correct]}</p>
                {!isCorrect && <p className="muted">{q.explanation}</p>}
              </div>
            );
          })}
        </section>
      )}

      <div style={{marginTop:20}}>
        <button className="back-btn" onClick={() => navigate("/student/tracks")}>Back to Companies</button>
        <button className="primary-btn" style={{marginLeft:12}} onClick={() => navigate("/student/quiz")}>Back to Quizzes</button>
      </div>
    </div>
  );
}

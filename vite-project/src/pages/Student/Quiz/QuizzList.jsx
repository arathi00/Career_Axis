import React from "react";
import "@/styles/QuizStyles.css";
import { useNavigate } from "react-router-dom";

export default function QuizList() {
  const navigate = useNavigate();

  const topics = [
    {
      id: 1,
      title: "Aptitude",
      desc: "Quantitative and logical reasoning",
      questions: 25,
    },
    {
      id: 2,
      title: "Technical - Java",
      desc: "OOP, core Java concepts",
      questions: 40,
    },
    {
      id: 3,
      title: "Technical - Python",
      desc: "Python fundamentals & logic",
      questions: 35,
    },
  ];

  return (
    <div className="quiz-page">
      <h1 className="quiz-title">Practice Quizzes</h1>
      <p className="quiz-subtitle">Choose a topic and test your skills</p>

      <div className="topics-grid">
        {topics.map((t) => (
          <div className="topic-card" key={t.id}>
            <h3>{t.title}</h3>
            <p>{t.desc}</p>

            <span className="topic-badge">{t.questions} questions</span>

            <button
              className="start-btn"
              onClick={() => navigate(`/student/quiz/${t.id}`)}
            >
              Start Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

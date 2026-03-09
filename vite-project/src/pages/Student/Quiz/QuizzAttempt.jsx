import React, { useState, useEffect } from "react";
import "@/styles/QuizStyles.css";
import { useParams, useNavigate } from "react-router-dom";
import { fetchQuizById, submitQuizAnswers } from "@/api/quizApi";  

  

export default function QuizzAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();

  // QUESTIONS: fetched from backend
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quiz, setQuiz] = useState(null);

  // fetch quiz by id
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchQuizById(id)
      .then((data) => {
        if (mounted) {
          setQuiz(data);
          // Transform backend schema to component schema
          const transformedQuestions = (data.questions || []).map((q) => ({
            question_id: q.question_id,
            question: q.question,
            options: q.options,
          }));
          setQuestions(transformedQuestions);
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Failed to load quiz");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => (mounted = false);
  }, [id]);

  // TIMER (10 minutes)
  const INITIAL_TIME = 600; // seconds
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const startRef = React.useRef(Date.now());

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // QUIZ STATES
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(
    JSON.parse(localStorage.getItem("quiz-progress"))?.selected || {}
  );
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [questionTimings, setQuestionTimings] = useState({});

  // Track time spent on current question
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [index]);

  // Calculate current question time
  const [currentQuestionTime, setCurrentQuestionTime] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuestionTime(Math.floor((Date.now() - questionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [questionStartTime]);

  // AUTO-SAVE ANSWERS
  useEffect(() => {
    localStorage.setItem("quiz-progress", JSON.stringify({ selected }));
  }, [selected]);

  // TIMER RUNNER
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  if (loading) return <div>Loading quiz...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!loading && questions.length === 0) return <div>No questions available</div>;

  const q = questions[index];

  const handleNext = () => {
    // Save time spent on current question
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    setQuestionTimings(prev => ({
      ...prev,
      [questions[index].question_id]: timeSpent
    }));
    
    if (index < questions.length - 1) setIndex(index + 1);
    else handleSubmit();
  };

  const handlePrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const handleSubmit = async () => {
    try {
      // Save timing for last question
      const lastQuestionTime = Math.floor((Date.now() - questionStartTime) / 1000);
      const finalTimings = {
        ...questionTimings,
        [questions[index].question_id]: lastQuestionTime
      };
      
      // Format answers: map question_id to selected option text with timing
      const answers = Object.entries(selected)
        .map(([index, optionIndex]) => ({
          question_id: questions[parseInt(index)]?.question_id,
          selected_answer: questions[parseInt(index)]?.options[optionIndex] || null,
          time_spent: finalTimings[questions[parseInt(index)]?.question_id] || 0
        }))
        .filter(a => a.question_id); // Only include answered questions

      // Calculate total time
      const totalTimeSeconds = INITIAL_TIME - timeLeft;
      const quizStartTime = new Date(startRef.current);

      // Submit to backend with timing data
      const result = await submitQuizAnswers(id, answers, quizStartTime.toISOString(), totalTimeSeconds);

      // Extract results for display
      const { score, total, percentage, questions: questionsWithAnswers } = result;

      // Build qa for local storage/display
      const qa = questions.map((q, i) => {
        const userAnswerIndex = selected[i];
        const userAnswer = userAnswerIndex !== undefined ? q.options[userAnswerIndex] : null;
        const correctQuestion = questionsWithAnswers.find(qwa => qwa.question_id === q.question_id);
        const isCorrect = userAnswer === correctQuestion?.correct_answer;

        return {
          q: q.question,
          options: q.options,
          answer: correctQuestion?.options.indexOf(correctQuestion.correct_answer) ?? -1,
          selectedIndex: userAnswerIndex,
          selectedAnswer: userAnswer,
          explanation: correctQuestion?.explanation || `Correct answer: ${correctQuestion?.correct_answer}`,
          isCorrect,
        };
      });

      // clear autosaved progress
      localStorage.removeItem("quiz-progress");

      // build attempt record and persist to localStorage
      const attempt = {
        quizId: Number(id),
        title: quiz?.topic || `Quiz ${id}`,
        score,
        total,
        percentage,
        timeTakenSec: Math.max(0, INITIAL_TIME - timeLeft),
        date: new Date().toISOString(),
        qa,
        selectedAnswers: Object.keys(selected).length ? selected : undefined,
      };

      try {
        const existing = JSON.parse(localStorage.getItem("quiz_attempts") || "[]");
        existing.unshift(attempt); // latest first
        localStorage.setItem("quiz_attempts", JSON.stringify(existing));
      } catch (err) {
        console.error("Failed to save quiz attempt", err);
      }

      // pass attempt to results page
      navigate("/student/quiz/result", {
        state: { score, total, attempt },
      });
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      alert("Failed to submit quiz: " + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <div className="quiz-attempt">

      {/* HEADER WITH TIMER AND PROGRESS - Matching Image UI */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#ffffff",
          padding: "16px 24px",
          borderRadius: "12px",
          marginBottom: "24px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
        }}
      >
        {/* Company/Quiz Title */}
        <div style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937" }}>
          {quiz?.company || "Quiz"} - {quiz?.exam_type || "Aptitude"}
        </div>

        {/* Circular Timer Display - Like in Image */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: currentQuestionTime > 120 ? "#fee2e2" : "#dbeafe",
            border: `4px solid ${currentQuestionTime > 120 ? "#ef4444" : "#3b82f6"}`,
            position: "relative"
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ 
              fontSize: "24px", 
              fontWeight: "700", 
              color: currentQuestionTime > 120 ? "#ef4444" : "#3b82f6" 
            }}>
              {currentQuestionTime > 60 ? Math.floor(currentQuestionTime / 60) : currentQuestionTime}
            </div>
            <div style={{ fontSize: "10px", color: "#6b7280" }}>
              {currentQuestionTime > 60 ? "min" : "sec"}
            </div>
          </div>
        </div>

        {/* Question Progress */}
        <div style={{ fontSize: "16px", fontWeight: "600", color: "#6b7280" }}>
          {index + 1} of {questions.length}
        </div>

        {/* Score Display */}
        <div style={{ fontSize: "16px", fontWeight: "600", color: "#6b7280" }}>
          Score: {Object.keys(selected).length}
        </div>
      </div>

      {/* Total Quiz Time Remaining */}
      <div
        style={{
          background: timeLeft <= 60 ? "#fee2e2" : "#f0fdf4",
          color: timeLeft <= 60 ? "#dc2626" : "#16a34a",
          fontWeight: "600",
          fontSize: "16px",
          padding: "10px",
          borderRadius: "8px",
          textAlign: "center",
          marginBottom: "20px",
          border: `2px solid ${timeLeft <= 60 ? "#dc2626" : "#16a34a"}`
        }}
      >
        ⏱️ Total Time Remaining: {formatTime(timeLeft)}
      </div>

      <div className="quiz-header">
        <p>Question {index + 1} of {questions.length}</p>

        {/* Difficulty Badge */}
        <span
          className="difficulty-badge"
          style={{
            background:
              q.difficulty === "Easy"
                ? "#22c55e"
                : q.difficulty === "Medium"
                ? "#f59e0b"
                : "#ef4444",
            color: "white",
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "14px"
          }}
        >
          {q.difficulty}
        </span>
      </div>

      <div className="question-box">{q.q}</div>

      <div className="options-list">
        {q.options.map((opt, i) => (
          <div
            key={i}
            className={`option-card ${selected[index] === i ? "selected" : ""}`}
            onClick={() => setSelected({ ...selected, [index]: i })}
          >
            {opt}
          </div>
        ))}
      </div>

      <div className="attempt-nav">
        <button disabled={index === 0} onClick={handlePrev}>Previous</button>

        <button onClick={handleNext}>
          {index === questions.length - 1 ? "Submit Quiz" : "Next"}
        </button>
      </div>
    </div>
  );
}

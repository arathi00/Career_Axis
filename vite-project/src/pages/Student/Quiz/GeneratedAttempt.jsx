import React, { useEffect, useState } from "react";
import "@/styles/QuizStyles.css";
import { useLocation, useNavigate } from "react-router-dom";
import { getGeneratedQuiz, submitQuizAnswers } from "@/api/quizApi";

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

export default function GeneratedAttempt(){
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const quizId = params.get("quiz_id");
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!quizId) {
      if (mounted) setError("Quiz ID is required");
      setLoading(false);
      return;
    }

    setLoading(true);
    getGeneratedQuiz(quizId)
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
      .finally(()=> mounted && setLoading(false));

    return ()=> mounted = false;
  }, [quizId]);

  // timer and quiz state (similar to QuizzAttempt)
  const INITIAL_TIME = 600;
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setInterval(()=> setTimeLeft(s => s-1), 1000);
    return ()=> clearInterval(t);
  }, [timeLeft]);

  const handleNext = () => { if (index < questions.length -1) setIndex(index+1); else handleSubmit(); }
  const handlePrev = () => { if (index>0) setIndex(index-1); }

  const handleSubmit = async () => {
    try {
      // Format answers: map question_id to selected option text
      const answers = Object.entries(selected)
        .map(([index, optionIndex]) => ({
          question_id: questions[parseInt(index)]?.question_id,
          selected_answer: questions[parseInt(index)]?.options[optionIndex] || null
        }))
        .filter(a => a.question_id); // Only include answered questions

      // Submit to backend
      const result = await submitQuizAnswers(quizId, answers);

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

      const timeTakenSec = Math.max(0, INITIAL_TIME - timeLeft);

      const attempt = {
        quizId: Number(quizId),
        title: quiz?.topic || `Quiz ${quizId}`,
        score,
        total,
        percentage,
        timeTakenSec,
        date: new Date().toISOString(),
        qa,
        selectedAnswers: selected,
      };

      try {
        const existing = JSON.parse(localStorage.getItem("quiz_attempts") || "[]");
        existing.unshift(attempt);
        localStorage.setItem("quiz_attempts", JSON.stringify(existing));
      } catch (err) { console.error(err); }

      navigate("/student/quiz/result", { state: { score, total, attempt } });
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      alert("Failed to submit quiz: " + (error.response?.data?.detail || error.message));
    }
  };

  if (loading) return <div>Loading quiz...</div>;
  if (error) return <div style={{color:'red'}}>Error: {error}</div>;
  if (!loading && questions.length === 0) return <div>No questions available</div>;

  const q = questions[index];

  return (
    <div className="quiz-attempt">
      <div style={{background:'#fff', color: timeLeft<=60 ? 'red':'#4f46e5', fontWeight:700, padding:12, borderRadius:8, textAlign:'center', marginBottom:20, width:220, marginLeft:'auto', marginRight:'auto'}}>
        ⏳ Time Left: {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}
      </div>

      <div className="quiz-header">
        <p>Question {index+1} of {questions.length}</p>
      </div>

      <div className="question-box">{q.question}</div>

      <div className="options-list">
        {q.options.map((opt,i) => (
          <div key={i} className={`option-card ${selected[index]===i ? 'selected' : ''}`} onClick={()=> setSelected({...selected, [index]: i})}>{opt}</div>
        ))}
      </div>

      <div className="attempt-nav">
        <button disabled={index===0} onClick={handlePrev}>Previous</button>
        <button onClick={handleNext}>{index===questions.length-1 ? 'Submit Quiz':'Next'}</button>
      </div>
    </div>
  );
}
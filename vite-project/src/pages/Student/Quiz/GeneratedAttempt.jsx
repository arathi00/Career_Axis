import React, { useEffect, useState } from "react";
import "@/styles/QuizStyles.css";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchQuizzes, fetchQuizById } from "@/api/quizApi";

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

export default function GeneratedAttempt(){
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const company = params.get("company");
  const level = params.get("level"); // Easy / Medium / Hard
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchQuizzes()
      .then(async (list) => {
        // fetch details for each and collect questions
        const ids = list.map((q) => q.id);
        const res = await Promise.all(ids.map((id) => fetchQuizById(id).catch(() => null)));
        let pool = [];
        res.forEach((r) =>{
          if (!r) return;
          const title = String(r.title || "").toLowerCase();
          const matchCompany = company ? (title.includes(String(company).toLowerCase()) || title.includes("aptitude")) : true;
          if (matchCompany){
            (r.questions || []).forEach((qq) => {
              if (!level || !qq.difficulty || qq.difficulty.toLowerCase() === level.toLowerCase()){
                pool.push({
                  q: qq.q,
                  options: qq.options,
                  answer: qq.answer,
                  explanation: qq.explanation || `Correct answer: ${qq.options[qq.answer]}`,
                });
              }
            });
          }
        });

        if (mounted){
          if (pool.length === 0){
            setError("No questions available for this selection.");
            setQuestions([]);
          } else {
            const final = shuffle(pool).slice(0, 10);
            setQuestions(final);
          }
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Failed to load quizzes");
      })
      .finally(()=> mounted && setLoading(false));

    return ()=> mounted = false;
  }, [company, level]);

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

  const handleSubmit = () => {
    let score = 0;
    const qa = questions.map((q, i) => {
      if (selected[i] === q.answer) score++;
      return { q: q.q, options: q.options, answer: q.answer, explanation: q.explanation };
    });

    const timeTakenSec = Math.max(0, INITIAL_TIME - timeLeft);

    const attempt = {
      quizId: null,
      title: company ? `${company} - ${level || 'Mixed'}` : `Generated Quiz - ${level || 'Mixed'}`,
      score,
      total: questions.length,
      percentage: questions.length ? Math.round((score / questions.length) * 100) : 0,
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

    navigate("/student/quiz/result", { state: { score, total: questions.length, attempt } });
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

      <div className="question-box">{q.q}</div>

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
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import QuestionCard from "@/components/Assessment/QuestionCard";
import { generateBankQuiz } from "@/api/quizApi";
import "./assessment.css";

export default function QuizAttempt(){
  const [searchParams] = useSearchParams();
  const companyName = searchParams.get('company');
  const level = searchParams.get('level');
  const type = searchParams.get('type') || 'Aptitude';
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(600);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  useEffect(()=>{
    // Generate quiz from bank questions
    const loadQuestions = async () => {
      try {
        setLoading(true);
        if (!companyName || !level || !type) {
          setError("Missing parameters");
          return;
        }

        const data = await generateBankQuiz({
          company: companyName,
          exam_type: type,
          difficulty: level,
          num_questions: 10
        });

        if (data.questions && data.questions.length > 0) {
          // Transform API response to component format
          const transformed = data.questions.map(q => ({
            q: q.question,
            options: q.options,
            answer: q.options.indexOf(q.correct_answer),
            explanation: q.explanation || `Correct answer: ${q.correct_answer}`
          }));
          setQuestions(transformed);
          setSecondsLeft(10 * 60); // Default 10 minutes
        } else {
          setError("No questions available for this selection");
          setQuestions([]);
        }
      } catch (err) {
        console.error("Failed to load questions:", err);
        setError("Failed to load questions from database");
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
    return () => { if (timerRef.current) clearInterval(timerRef.current); }
  }, [companyName, level, type]);

  useEffect(()=>{
    if (questions.length === 0) return;
    // start timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1){ clearInterval(timerRef.current); handleSubmit(); return 0; }
        return s-1;
      })
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  if (loading) return <div style={{padding:24}}>Loading questions from database...</div>;
  if (error) return <div style={{padding:24, color: 'red'}}>Error: {error}</div>;
  if (questions.length === 0) return <div style={{padding:24}}>No questions available for this selection.</div>;

  const q = questions[index];

  const formatTime = (sec) => {
    const m = Math.floor(sec/60).toString().padStart(2,'0');
    const s = Math.floor(sec%60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }

  const handleNext = () => { if (index < questions.length -1) setIndex(index+1); else handleSubmit(); }
  const handlePrev = () => { if (index > 0) setIndex(index-1); }

  const handleJump = (i) => setIndex(i);

  const handleSubmit = () => {
    let score=0;
    const qa = questions.map((item,i) => {
      if (selected[i] === item.answer) score++;
      return { q: item.q, options: item.options, answer: item.answer, explanation: item.explanation };
    });

    const attempt = {
      title: `${companyName} - ${type} - ${level || 'Mixed'}`,
      score,
      total: questions.length,
      percentage: Math.round((score/questions.length)*100),
      date: new Date().toISOString(),
      qa,
      selectedAnswers: selected,
      meta: { company: companyName, level, type }
    };

    try{ const existing = JSON.parse(localStorage.getItem('quiz_attempts')||'[]'); existing.unshift(attempt); localStorage.setItem('quiz_attempts', JSON.stringify(existing)); }catch(e){console.error(e)}

    navigate('/student/assessments/result', { state: { attempt } });
  };

  return (
    <div className="container quiz-attempt-page">
      {/* Header with Company, Type, Level */}
      <div className="quiz-header-top">
        <button className="back" onClick={() => navigate('/student/assessments/company/' + companyName)}>← Back to Selection</button>
        <div className="quiz-badges">
          <span className="badge-company">{companyName}</span>
          <span className="badge-type">{type}</span>
          <span className={`badge-level badge-${level.toLowerCase()}`}>{level}</span>
        </div>
      </div>

      {/* Progress and Question Count */}
      <div className="quiz-progress-section">
        <div className="progress-info">
          <p>Question {index+1} of {questions.length}</p>
          <p className="answered-count">{Object.keys(selected).length} answered</p>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{width: `${((index+1)/questions.length)*100}%`}}></div>
        </div>
      </div>

      {/* Question Card */}
      <QuestionCard qIndex={index} item={q} selected={selected[index]} onSelect={(i) => setSelected({...selected, [index]: i})} />

      {/* Question Navigator */}
      <div className="question-navigator-section">
        <p>Question Navigator</p>
        <div className="qNav">
          {questions.map((_,i) => (
            <button key={i} className={`qNum ${i===index? 'active' : ''}`} onClick={() => handleJump(i)}>{i+1}</button>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="attempt-nav">
        <button className="nav-btn nav-prev" disabled={index===0} onClick={handlePrev}>← Previous</button>
        <button className="nav-btn nav-next" onClick={handleNext}>{index===questions.length-1 ? 'Submit' : 'Next'} →</button>
      </div>
    </div>
  );
}
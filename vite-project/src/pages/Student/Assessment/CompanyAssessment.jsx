import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DifficultyCard from "@/components/Assessment/DifficultyCard";
import QuizSelection from "@/components/Assessment/QuizSelection";
import { getCompanyStats, getAvailableQuizzes } from "@/api/quizApi";
import "./assessment.css";

export default function CompanyAssessment(){
  const { name } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [company, setCompany] = useState(null);
  const [types, setTypes] = useState([]);
  const [type, setType] = useState("");
  const [difficulties, setDifficulties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load company data and available exam types
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setLoading(true);
        const companies = await getCompanyStats();
        const foundCompany = companies.find(c => c.name === name);
        
        if (!foundCompany) {
          setError("Company not found");
          return;
        }
        
        setCompany(foundCompany);
        setTypes(foundCompany.tags || []);
        
        // Get URL params
        const params = new URLSearchParams(location.search);
        const qType = params.get('type');
        const initialType = qType && foundCompany.tags?.includes(qType) ? qType : (foundCompany.tags?.[0] || 'Technical');
        setType(initialType);
      } catch (err) {
        console.error('Failed to load company data:', err);
        setError('Failed to load company data');
      } finally {
        setLoading(false);
      }
    };
    
    loadCompanyData();
  }, [name, location.search]);

  // Load available quizzes for selected type
  useEffect(() => {
    const loadQuizzes = async () => {
      if (!company || !type) return;
      
      try {
        const data = await getAvailableQuizzes(company.name, type);
        setDifficulties(data.difficulties || []);
      } catch (err) {
        console.error('Failed to load quizzes:', err);
        setDifficulties([]);
      }
    };
    
    loadQuizzes();
  }, [company, type]);

  if (loading) return <div style={{padding: 24}}>Loading...</div>;
  if (error) return <div style={{padding: 24, color: 'red'}}>{error}</div>;
  if (!company) return <div style={{padding: 24}}>Company not found</div>;

  const totalQuestions = company.totalQuestions ?? 0;

  return (
    <div className="container">
      <button className="back" onClick={() => navigate('/student/assessments')}>← Back to Companies</button>
      <div className="company-header-section">
        <div className="company-logo-mini">{(company.abbreviation || company.name.substring(0,3)).toUpperCase()}</div>
        <div>
          <h1>{company.name}</h1>
          <p className="muted">Select a quiz type and difficulty level</p>
        </div>
      </div>

      {types && types.length > 0 ? (
        <>
          <div className="typeTabs">
            {types.map(t => (
              <button key={t} className={`tab ${t===type? 'active' : ''}`} onClick={() => setType(t)}>
                <span>{t}</span>
              </button>
            ))}
          </div>

          <QuizSelection company={company} type={type} difficulties={difficulties} onSelectQuiz={(quizType, level) => navigate(`/student/assessments/quiz?company=${encodeURIComponent(company.name)}&type=${encodeURIComponent(quizType)}&level=${encodeURIComponent(level)}`)} onBack={() => navigate('/student/assessments')} />
        </>
      ) : (
        <p style={{color:'#dc2626', padding:'20px'}}>No quizzes available for this company.</p>
      )}
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CompanyCard from "@/components/Assessment/CompanyCard";
import { getCompanyStats } from "@/api/quizApi";
import "./assessment.css";

export default function AssessmentHome(){
  const [q, setQ] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoading(true);
        const data = await getCompanyStats();
        // Transform data to match CompanyCard expectations
        const transformedCompanies = data.map(company => ({
          id: company.name.toLowerCase(),
          name: company.name,
          abbreviation: company.name.substring(0, 3).toUpperCase(),
          tags: company.tags || [],
          overview: company.overview,
          totalQuestions: company.totalQuestions
        }));
        setCompanies(transformedCompanies);
        setError(null);
      } catch (err) {
        console.error('Failed to load companies:', err);
        setError('Failed to load companies from database');
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };
    loadCompanies();
  }, []);

  const filtered = companies.filter(c => c.name.toLowerCase().includes(q.toLowerCase()));
  
  return (
    <div className="container ass-page">
      <header className="ass-hero">
        <div className="ass-hero-icon">🏢</div>
        <h1 className="title">Company Assessments</h1>
        <p className="subtitle">Practice with company-specific aptitude and technical questions. Choose a company to explore their quiz patterns and difficulty levels.</p>
      </header>

      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input className="search" placeholder="Search companies..." value={q} onChange={(e)=> setQ(e.target.value)} />
      </div>

      {loading ? (
        <div className="loading">Loading companies...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="grid">
          {filtered.length > 0 ? (
            filtered.map(c => (
              <CompanyCard
                key={c.id || c.name}
                company={c}
                onView={(company, type) => navigate(`/student/assessments/company/${encodeURIComponent(company.name)}${type ? `?type=${encodeURIComponent(type)}` : ''}`)}
              />
            ))
          ) : (
            <p>No companies found</p>
          )}
        </div>
      )}
    </div>
  );
}
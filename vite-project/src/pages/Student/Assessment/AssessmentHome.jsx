import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanyCard from "@/components/Assessment/CompanyCard";
import { companies } from "./assessmentData";
import "./assessment.css";

export default function AssessmentHome(){
  const [q, setQ] = useState("");
  const navigate = useNavigate();

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

      <div className="grid">
        {filtered.map(c => (
          <CompanyCard
            key={c.id || c.name}
            company={c}
            onView={(company, type) => navigate(`/student/assessments/company/${encodeURIComponent(company.name)}${type ? `?type=${encodeURIComponent(type)}` : ''}`)}
          />
        ))}
      </div>
    </div>
  );
}
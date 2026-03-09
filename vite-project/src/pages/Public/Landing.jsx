import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/landing.css';

import heroImg from "@/assets/images/Screenshot 2026-01-13 121446.png";

export default function Landing(){
  const navigate = useNavigate();
  return (
    <div className="landing-hero">
      <div className="landing-inner container">
        <div className="hero-left">
          <img src={heroImg} alt="hero" className="hero-image" />
        </div>
        <div className="hero-right">
          <h1>Master Your\nCareer Journey</h1>
          <p>Unlock your potential with AI-assisted resume building, personalized training paths, mock interviews, and comprehensive skill assessments designed for placement success.</p>

          <div className="hero-actions">
            <button className="primary hero-cta" onClick={() => navigate('/register')}>Start Your Journey →</button>
            <button className="secondary" onClick={() => navigate('/login')}>Explore Features</button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">95%</div>
              <div className="stat-label">Success Rate</div>
            </div>
            <div className="stat">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Students Trained</div>
            </div>
            <div className="stat">
              <div className="stat-number">AI</div>
              <div className="stat-label">Powered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

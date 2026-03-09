import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/getstarted.css';

export default function GetStarted(){
  const navigate = useNavigate();
  return (
    <div className="getstarted-wrap container">
      <div className="getstarted-card">
        <h2>Welcome to Career Axis</h2>
        <p>Get started by registering a new account or login if you already have one.</p>

        <div className="gs-actions">
          <button className="primary" onClick={() => navigate('/register')}>Create an account</button>
          <button className="secondary" onClick={() => navigate('/login')}>I already have an account</button>
        </div>

        <div className="gs-note">You can access assessments, resume tools and mock interviews after signing in.</div>
      </div>
    </div>
  )
}

import React, { useState } from 'react';
import './FreeAIEnhancer.css';

const FreeAIEnhancer = ({ resumeData, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [enhanceMode, setEnhanceMode] = useState('single');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  // 🔥 Backend AI Call
  const callBackendAI = async (summary, skills, projects) => {
    const response = await fetch(
      "http://localhost:8000/resume/ai/optimize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          resume_data: {
            summary,
            technical_skills: skills ? skills.split(',').map(s => s.trim()) : [],
            projects: projects ? [{ description: projects }] : []
          },
          job_title: jobTitle || null,
          job_description: jobDescription || null
        })
      }
    );

    if (!response.ok) {
      throw new Error("Backend AI failed");
    }

    return await response.json();
  };

  // 🚀 Enhance All Sections
  const enhanceAllSections = async () => {
    if (!resumeData) return;

    if (!jobTitle && !jobDescription) {
      alert("Please enter Job Title or Job Description");
      return;
    }

    setLoading(true);

    try {
      const summary = resumeData.summary || '';
      const skills = resumeData.skills || '';
      const projects = resumeData.projects?.[0]?.description || '';

      const data = await callBackendAI(summary, skills, projects);

      setResults({
        objective: {
          original: summary,
          enhanced: data.optimized_resume?.summary
        },
        skills: {
          original: skills,
          enhanced: data.optimized_resume?.technical_skills?.join(', ')
        },
        projects: {
          original: projects,
          enhanced: data.optimized_resume?.projects?.[0]?.description
        },
        ats_score: data.ats_score,
        missing_keywords: data.missing_keywords,
        mode: 'all'
      });

      setActiveTab('summary');

    } catch (error) {
      console.error(error);
      alert("AI optimization failed");
    } finally {
      setLoading(false);
    }
  };

  // 📝 Enhance Single Section
  const enhanceSingleSection = async () => {
    if (!jobTitle && !jobDescription) {
      alert("Please enter Job Title or Job Description");
      return;
    }

    setLoading(true);

    try {
      const summary = resumeData.summary || '';
      const skills = resumeData.skills || '';
      const projects = resumeData.projects?.[0]?.description || '';

      const data = await callBackendAI(summary, skills, projects);

      let enhancedText = '';

      if (activeTab === 'summary') {
        enhancedText = data.optimized_resume?.summary;
      }
      if (activeTab === 'skills') {
        enhancedText = data.optimized_resume?.technical_skills?.join(', ');
      }
      if (activeTab === 'projects') {
        enhancedText = data.optimized_resume?.projects?.[0]?.description;
      }

      setResults({
        [activeTab]: {
          original: resumeData[activeTab] || '',
          enhanced: enhancedText
        },
        ats_score: data.ats_score,
        missing_keywords: data.missing_keywords,
        mode: 'single',
        activeSection: activeTab
      });

    } catch (error) {
      console.error(error);
      alert("AI optimization failed");
    } finally {
      setLoading(false);
    }
  };

  const applyEnhancement = () => {
    if (!results) return;

    const updated = { ...resumeData };

    if (results.mode === 'all') {
      updated.summary = results.objective?.enhanced || updated.summary;
      updated.skills = results.skills?.enhanced || updated.skills;

      if (updated.projects?.length > 0) {
        updated.projects[0].description =
          results.projects?.enhanced || updated.projects[0].description;
      }
    } else {
      const enhanced = results[results.activeSection]?.enhanced;

      if (results.activeSection === 'summary') {
        updated.summary = enhanced;
      }
      if (results.activeSection === 'skills') {
        updated.skills = enhanced;
      }
      if (results.activeSection === 'projects') {
        if (updated.projects?.length > 0) {
          updated.projects[0].description = enhanced;
        }
      }
    }

    onUpdate(updated);
    alert("✅ AI enhancement applied!");
  };

  const getCurrentResult = () => {
    if (!results) return null;

    if (results.mode === 'all') {
      if (activeTab === 'summary') return results.objective;
      if (activeTab === 'skills') return results.skills;
      if (activeTab === 'projects') return results.projects;
    }

    if (results.mode === 'single' && results.activeSection === activeTab) {
      return results[activeTab];
    }

    return null;
  };

  return (
    <div className="free-ai-container">
      <h4>🚀 AI Resume Optimizer (Backend Secured)</h4>

      {/* Job Context Input */}
      <div className="job-context">
        <input
          type="text"
          placeholder="Enter Job Title (optional)"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />

        <textarea
          placeholder="Paste Job Description (optional)"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <small>⚠️ Enter at least Job Title OR Job Description</small>
      </div>

      {/* Mode Selector */}
      <div className="enhance-mode-selector">
        <button onClick={() => setEnhanceMode('single')}>
          📝 Current Section
        </button>
        <button onClick={() => setEnhanceMode('all')}>
          🚀 All Sections
        </button>
      </div>

      {/* Tabs */}
      <div className="ai-tabs">
        <button onClick={() => setActiveTab('summary')}>Summary</button>
        <button onClick={() => setActiveTab('skills')}>Skills</button>
        <button onClick={() => setActiveTab('projects')}>Projects</button>
      </div>

      {/* Enhance Button */}
      <button
        className="ai-btn"
        onClick={enhanceMode === 'all' ? enhanceAllSections : enhanceSingleSection}
        disabled={loading}
      >
        {loading ? "✨ AI Thinking..." : "✨ Optimize Resume"}
      </button>

      {/* Results */}
      {results && getCurrentResult() && (
        <div className="ai-results">
          <h5>Original:</h5>
          <p>{getCurrentResult().original}</p>

          <h5>AI Enhanced:</h5>
          <p>{getCurrentResult().enhanced}</p>

          <button onClick={applyEnhancement}>
            ✅ Apply Enhancement
          </button>

          {results.ats_score && (
            <div className="ats-score">
              <h4>ATS Score: {results.ats_score}%</h4>
            </div>
          )}

          {results.missing_keywords?.length > 0 && (
            <div>
              <h5>Missing Keywords:</h5>
              <ul>
                {results.missing_keywords.map((kw, i) => (
                  <li key={i}>{kw}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FreeAIEnhancer;
import React from 'react';

const AIJobAnalyzer = ({
  jobInput,
  setJobInput,
  jdFile,
  onFileUpload,
  uploadProgress,
  loading,
  error,
  jobAnalysis,
  onAnalyze,
  onBuildResume,
  onSkip,
  onBack
}) => {
  return (
    <div className="job-analyzer-container">
      <h2>🎯 Tell Us About Your Target Job</h2>
      <p className="subtitle">This helps us create an ATS-optimized resume tailored to your dream role</p>

      <div className="input-toggle">
        <button 
          className={`toggle-btn ${jobInput.useJD ? 'active' : ''}`}
          onClick={() => setJobInput({...jobInput, useJD: true})}
        >
          📄 Upload Job Description
        </button>
        <button 
          className={`toggle-btn ${!jobInput.useJD ? 'active' : ''}`}
          onClick={() => setJobInput({...jobInput, useJD: false})}
        >
          📝 Enter Job Title
        </button>
      </div>

      {jobInput.useJD ? (
        <div className="jd-upload-section">
          <div className="file-upload-area">
            <input
              type="file"
              id="jd-file"
              accept=".txt,.pdf,.doc,.docx"
              onChange={onFileUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="jd-file" className="file-upload-label">
              <span className="upload-icon">📎</span>
              <span>Click to upload Job Description</span>
              <span className="file-types">Supports: PDF, DOCX, TXT</span>
            </label>
          </div>
          
          {uploadProgress > 0 && (
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${uploadProgress}%`}}></div>
            </div>
          )}
          
          {jdFile && (
            <div className="file-info">
              <span>📄 {jdFile.name}</span>
              <button onClick={() => setJdFile(null)}>✖</button>
            </div>
          )}
          
          <textarea
            placeholder="Or paste job description here..."
            value={jobInput.jobDescription}
            onChange={(e) => setJobInput({...jobInput, jobDescription: e.target.value})}
            rows={6}
            className="jd-textarea"
          />
        </div>
      ) : (
        <div className="job-title-input">
          <label>Enter Desired Job Title</label>
          <input
            type="text"
            value={jobInput.jobTitle}
            onChange={(e) => setJobInput({...jobInput, jobTitle: e.target.value})}
            placeholder="e.g., Senior Software Engineer, Data Scientist, Product Manager"
          />
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {/* Analysis Results */}
      {jobAnalysis && (
        <div className="analysis-results">
          <h3>📊 Job Match Analysis</h3>
          
          {jobAnalysis.match_percentage && (
            <div className="match-score">
              <div className="score-circle">
                <span className="score-value">{jobAnalysis.match_percentage}%</span>
              </div>
              <p>Overall Match</p>
            </div>
          )}

          {jobAnalysis.matched_skills?.length > 0 && (
            <div className="skills-match">
              <h4>✅ Matched Skills</h4>
              <div className="skills-list">
                {jobAnalysis.matched_skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag matched">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {jobAnalysis.missing_skills?.length > 0 && (
            <div className="skills-match">
              <h4>⚠️ Skills to Add</h4>
              <div className="skills-list">
                {jobAnalysis.missing_skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag missing">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="action-buttons">
        <button className="secondary-btn" onClick={onBack}>
          ← Back
        </button>
        <button 
          className="secondary-btn"
          onClick={onSkip}
        >
          Skip AI
        </button>
        <button 
          className="primary-btn"
          onClick={onAnalyze}
          disabled={loading || (!jobInput.jobTitle && !jobInput.jobDescription)}
        >
          {loading ? 'Analyzing...' : '🔍 Analyze Match'}
        </button>
        <button 
          className="primary-btn highlight"
          onClick={onBuildResume}
          disabled={loading || (!jobInput.jobTitle && !jobInput.jobDescription)}
        >
          {loading ? 'Building...' : '🚀 Build AI Resume'}
        </button>
      </div>
    </div>
  );
};

export default AIJobAnalyzer;
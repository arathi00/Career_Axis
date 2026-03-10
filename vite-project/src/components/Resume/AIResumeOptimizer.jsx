import React from 'react';

const AIResumeOptimizer = ({ aiResume, onBack, onApply }) => {
  if (!aiResume) return null;

  return (
    <div className="ai-optimizer-container">
      <div className="optimizer-header">
        <h2>✨ AI-Optimized Resume Analysis</h2>
        <p>Your resume has been optimized for the target job</p>
      </div>

      {/* ATS Score Card */}
      <div className="ats-score-card">
        <div className="score-header">
          <h3>ATS Compatibility Score</h3>
          <span className="score-badge">{aiResume.ats_analysis?.score || 0}/100</span>
        </div>
        
        <div className="score-breakdown">
          {aiResume.ats_analysis?.breakdown && (
            <>
              <div className="breakdown-item">
                <span className="breakdown-label">Keyword Match</span>
                <div className="breakdown-bar">
                  <div 
                    className="breakdown-fill" 
                    style={{width: `${aiResume.ats_analysis.breakdown.keyword_match}%`}}
                  ></div>
                </div>
                <span className="breakdown-value">{aiResume.ats_analysis.breakdown.keyword_match}%</span>
              </div>
              
              <div className="breakdown-item">
                <span className="breakdown-label">Skills Match</span>
                <div className="breakdown-bar">
                  <div 
                    className="breakdown-fill" 
                    style={{width: `${aiResume.ats_analysis.breakdown.skills_match}%`}}
                  ></div>
                </div>
                <span className="breakdown-value">{aiResume.ats_analysis.breakdown.skills_match}%</span>
              </div>
              
              <div className="breakdown-item">
                <span className="breakdown-label">Experience Match</span>
                <div className="breakdown-bar">
                  <div 
                    className="breakdown-fill" 
                    style={{width: `${aiResume.ats_analysis.breakdown.experience_match}%`}}
                  ></div>
                </div>
                <span className="breakdown-value">{aiResume.ats_analysis.breakdown.experience_match}%</span>
              </div>
              
              <div className="breakdown-item">
                <span className="breakdown-label">Education Match</span>
                <div className="breakdown-bar">
                  <div 
                    className="breakdown-fill" 
                    style={{width: `${aiResume.ats_analysis.breakdown.education_match}%`}}
                  ></div>
                </div>
                <span className="breakdown-value">{aiResume.ats_analysis.breakdown.education_match}%</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Keywords Section */}
      <div className="keywords-section">
        <div className="keywords-row">
          <div className="keywords-box matched">
            <h4>
              <span className="box-icon">✅</span>
              Matched Keywords ({aiResume.ats_analysis?.matched_keywords?.length || 0})
            </h4>
            <div className="keywords-list">
              {aiResume.ats_analysis?.matched_keywords?.map((keyword, idx) => (
                <span key={idx} className="keyword-tag matched">{keyword}</span>
              ))}
              {(!aiResume.ats_analysis?.matched_keywords || aiResume.ats_analysis.matched_keywords.length === 0) && (
                <p className="no-items">No matched keywords found</p>
              )}
            </div>
          </div>

          <div className="keywords-box missing">
            <h4>
              <span className="box-icon">⚠️</span>
              Missing Keywords ({aiResume.ats_analysis?.missing_keywords?.length || 0})
            </h4>
            <div className="keywords-list">
              {aiResume.ats_analysis?.missing_keywords?.map((keyword, idx) => (
                <span key={idx} className="keyword-tag missing">{keyword}</span>
              ))}
              {(!aiResume.ats_analysis?.missing_keywords || aiResume.ats_analysis.missing_keywords.length === 0) && (
                <p className="no-items">No missing keywords - Great job!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Optimized Content Preview */}
      <div className="optimized-content">
        <h3>📝 Optimized Resume Preview</h3>
        
        {/* Summary */}
        {aiResume.professional_summary && (
          <div className="content-section">
            <h4>Professional Summary</h4>
            <div className="content-box highlight">
              <p>{aiResume.professional_summary}</p>
            </div>
          </div>
        )}

        {/* Skills */}
        {aiResume.skills?.technical_skills?.length > 0 && (
          <div className="content-section">
            <h4>Prioritized Skills</h4>
            <div className="skills-preview">
              {aiResume.skills.technical_skills.map((skill, idx) => (
                <span key={idx} className="skill-pill">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {aiResume.projects?.length > 0 && (
          <div className="content-section">
            <h4>Enhanced Projects</h4>
            {aiResume.projects.map((project, idx) => (
              <div key={idx} className="project-preview">
                <h5>{project.name || project.title}</h5>
                <p>{project.description}</p>
                {project.technologies?.length > 0 && (
                  <div className="project-tech">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {aiResume.achievements?.length > 0 && (
          <div className="content-section">
            <h4>Enhanced Achievements</h4>
            <ul className="achievements-list">
              {aiResume.achievements.map((achievement, idx) => (
                <li key={idx}>{achievement}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {aiResume.ats_analysis?.recommendations?.length > 0 && (
          <div className="content-section recommendations">
            <h4>📋 Recommendations to Improve Further</h4>
            <ul>
              {aiResume.ats_analysis.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="optimizer-actions">
        <button className="secondary-btn" onClick={onBack}>
          <span className="btn-icon">←</span>
          Back to Preview
        </button>
        <button className="primary-btn" onClick={onApply}>
          <span className="btn-icon">✅</span>
          Apply Optimizations
        </button>
        <button className="primary-btn download-btn">
          <span className="btn-icon">📥</span>
          Download Resume
        </button>
      </div>
    </div>
  );
};

export default AIResumeOptimizer;
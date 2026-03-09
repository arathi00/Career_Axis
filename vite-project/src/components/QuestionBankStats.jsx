import React, { useEffect, useState } from 'react';
import { getQuestionBankStats } from '../api/quizApi';
import '../styles/QuestionBankStats.css';

/**
 * Question Bank Statistics Dashboard (Admin Only)
 * Shows configured vs actual question counts for each company
 */
export default function QuestionBankStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getQuestionBankStats();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load stats:', err);
      setError(err.response?.data?.detail || 'Failed to load question bank statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="stats-loading">Loading question bank statistics...</div>;
  }

  if (error) {
    return <div className="stats-error">❌ {error}</div>;
  }

  if (!stats) {
    return <div className="stats-error">No statistics available</div>;
  }

  return (
    <div className="question-bank-stats">
      <h1>📊 Question Bank Statistics</h1>
      
      {/* Overall Summary */}
      <div className="stats-summary">
        <div className="stat-card">
          <h3>Total Companies</h3>
          <div className="stat-value">{stats.total_companies}</div>
        </div>
        <div className="stat-card">
          <h3>Configured Questions</h3>
          <div className="stat-value">{stats.total_configured_questions}</div>
        </div>
        <div className="stat-card">
          <h3>Questions in Database</h3>
          <div className="stat-value">{stats.total_questions_in_db}</div>
        </div>
        <div className="stat-card">
          <h3>Overall Completion</h3>
          <div className="stat-value">{stats.overall_completion.toFixed(1)}%</div>
          <div className="stat-progress">
            <div 
              className="stat-progress-bar" 
              style={{ width: `${stats.overall_completion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Per-Company Breakdown */}
      <div className="company-stats">
        <h2>Company Breakdown</h2>
        <table className="stats-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Track</th>
              <th>Configured</th>
              <th>In Database</th>
              <th>Completion</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.company_stats.map((company, idx) => (
              <tr key={idx}>
                <td className="company-name">{company.company}</td>
                <td>{company.track}</td>
                <td>{company.configured}</td>
                <td>{company.in_database}</td>
                <td>
                  <div className="completion-cell">
                    <span>{company.completion_percentage.toFixed(1)}%</span>
                    <div className="mini-progress">
                      <div 
                        className="mini-progress-bar"
                        style={{ 
                          width: `${company.completion_percentage}%`,
                          backgroundColor: getCompletionColor(company.completion_percentage)
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(company.completion_percentage)}`}>
                    {getStatusText(company.completion_percentage)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Refresh Button */}
      <div className="stats-actions">
        <button className="btn-refresh" onClick={loadStats}>
          🔄 Refresh Statistics
        </button>
      </div>

      {/* Info Box */}
      <div className="stats-info">
        <h3>ℹ️ About Question Bank</h3>
        <ul>
          <li><strong>Configured:</strong> Total questions planned for each company/category</li>
          <li><strong>In Database:</strong> Actual questions currently stored in the system</li>
          <li><strong>Completion:</strong> Percentage of configured questions that exist in database</li>
          <li>AI will automatically generate questions when database count is below required count</li>
        </ul>
      </div>
    </div>
  );
}

// Helper functions
function getCompletionColor(percentage) {
  if (percentage >= 80) return '#10b981'; // Green
  if (percentage >= 50) return '#f59e0b'; // Orange
  return '#ef4444'; // Red
}

function getStatusClass(percentage) {
  if (percentage >= 80) return 'status-complete';
  if (percentage >= 50) return 'status-partial';
  return 'status-incomplete';
}

function getStatusText(percentage) {
  if (percentage >= 80) return '✅ Complete';
  if (percentage >= 50) return '⚠️ Partial';
  return '❌ Incomplete';
}

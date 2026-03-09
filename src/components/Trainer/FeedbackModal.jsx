import React, { useState } from "react";
import "./FeedbackModal.css";

const FeedbackModal = ({ interviewId, onClose, onSubmit }) => {
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (score === "" || score < 0 || score > 100) {
      setError("Score must be between 0 and 100");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await onSubmit(interviewId, {
        score: Number(score),
        feedback: feedback, // ✅ FIXED KEY (was comments)
      });

      onClose();
    } catch (err) {
      setError("Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-overlay">
      <div className="feedback-modal">
        <h3>Interview Feedback</h3>

        <label>Score (0 – 100)</label>
        <input
          type="number"
          min="0"
          max="100"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />

        <label>Comments</label>
        <textarea
          rows="4"
          placeholder="Write comments about the interview"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        {error && <p className="error-text">{error}</p>}

        <div className="modal-actions">
          <button
            className="btn secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="btn primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
import React, { useState } from "react";
import FeedbackModal from "./FeedbackModal";
import { submitFeedback, completeInterview } from "../../api/interviewApi";

const InterviewItem = ({ interview }) => {
  const {
    id,
    date,
    time,
    status,
    join_link,
    student,
    position,
  } = interview;

  const [showFeedback, setShowFeedback] = useState(false);

  const normalizedStatus = status?.toLowerCase();
  const studentName = student?.name || "Not assigned";
  const displayTime = `${date} at ${time}`;

  // Submit feedback
  const handleSubmitFeedback = async (interviewId, data) => {
    try {
      await submitFeedback(interviewId, data);
      window.location.reload();
    } catch (error) {
      alert("Failed to submit feedback");
    }
  };

  // Mark interview as completed
  const handleMarkCompleted = async () => {
    try {
      await completeInterview(id);
      window.location.reload();
    } catch (err) {
      alert("Failed to mark interview completed");
    }
  };

  return (
    <>
      <div className="student-card" style={{ alignItems: "center" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div className="avatar">
            {studentName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>

          <div>
            <div className="student-name">{studentName}</div>
            <div className="muted">{displayTime}</div>
            {position && <div className="muted">{position}</div>}
          </div>
        </div>

        <div style={{ textAlign: "right", minWidth: 240 }}>
          <div className="muted">
            Status: <strong>{normalizedStatus}</strong>
          </div>

          <div
            style={{
              marginTop: 8,
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
            }}
          >
            {join_link && (
              <a
                href={join_link}
                className="view-btn"
                target="_blank"
                rel="noreferrer"
              >
                Join
              </a>
            )}

            {/* ✅ FIXED HERE */}
            {normalizedStatus === "scheduled" && (
              <button
                className="view-btn"
                onClick={handleMarkCompleted}
              >
                Mark Completed
              </button>
            )}

            {normalizedStatus === "completed" && (
              <button
                className="view-btn"
                onClick={() => setShowFeedback(true)}
              >
                Give Feedback
              </button>
            )}
          </div>
        </div>
      </div>

      {showFeedback && (
        <FeedbackModal
          interviewId={id}
          onClose={() => setShowFeedback(false)}
          onSubmit={handleSubmitFeedback}
        />
      )}
    </>
  );
};

export default InterviewItem;

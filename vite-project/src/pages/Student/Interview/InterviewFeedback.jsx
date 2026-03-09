import React, { useEffect, useState } from "react";
import interviewApi from "../../../api/interviewApi";
import useAuth from "../../../hooks/useAuth"; // FIXED HERE

const InterviewFeedback = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    interviewApi.getStudentInterviews(user.id)
      .then((data) => setHistory(data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="page interview-feedback-page">
      <h2>My Mock Interviews</h2>

      {loading ? (
        <p>Loading...</p>
      ) : history.length === 0 ? (
        <p>No interviews found.</p>
      ) : (
        history.map((i) => (
          <div key={i.id} className="card">
            <p><b>Date:</b> {new Date(i.dateTime).toLocaleString()}</p>
            <p><b>Trainer:</b> {i.trainerName || "—"}</p>
            <p><b>Feedback:</b> {i.feedback || "Not provided yet"}</p>
            <p><b>Rating:</b> {i.rating || "—"}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default InterviewFeedback;

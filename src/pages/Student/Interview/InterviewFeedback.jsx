import React, { useEffect, useState } from "react";
import { getMyInterviews } from "../../../api/interviewApi";
import useAuth from "../../../hooks/useAuth";

const InterviewFeedback = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    getMyInterviews()
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
            <p>
              <b>Date:</b>{" "}
              {i.date
                ? new Date(`${i.date} ${i.time}`).toLocaleString()
                : "—"}
            </p>

            <p>
              <b>Trainer:</b> {i.trainer?.name || "—"}
            </p>

            <p>
              <b>Score:</b>{" "}
              {i.score !== null && i.score !== undefined
                ? `${i.score} / 100`
                : "Pending"}
            </p>

            <p>
              <b>Comments:</b>{" "}
              {i.comments ? i.comments : "Feedback not provided yet"}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default InterviewFeedback;

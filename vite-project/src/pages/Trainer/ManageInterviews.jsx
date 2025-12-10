import React, { useEffect, useState } from "react";
import interviewApi from "../../api/interviewApi";
import InterviewWindow from "../../components/UI/InterviewWindow";
import useAuth from "../../hooks/useAuth"; // FIXED HERE

const ManageInterviews = () => {
  const { user } = useAuth(); // now works
  const [slots, setSlots] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const load = () => {
    if (!user) return;
    interviewApi
      .getTrainerInterviews(user.id)
      .then((data) => setSlots(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    load();
  }, [user]);

  return (
    <div className="page trainer-manage-interviews">
      <h2>Manage Interviews</h2>

      {slots.length === 0 ? (
        <p>No interviews yet</p>
      ) : (
        slots.map((i) => (
          <div key={i.id} className="card">
            <p><b>Date:</b> {new Date(i.dateTime).toLocaleString()}</p>
            <p><b>Student:</b> {i.studentName || "Not booked"}</p>

            <button
              className="btn"
              onClick={() => setSelectedInterview(i.id)}
            >
              Join Interview
            </button>
          </div>
        ))
      )}

      {selectedInterview && (
        <InterviewWindow
          interviewId={selectedInterview}
          role="trainer"
          onEnd={() => setSelectedInterview(null)}
        />
      )}
    </div>
  );
};

export default ManageInterviews;

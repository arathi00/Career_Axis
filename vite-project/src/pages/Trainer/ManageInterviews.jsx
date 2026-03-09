import React, { useEffect, useState } from "react";
import interviewApi from "../../api/interviewApi";
import InterviewWindow from "../../components/UI/InterviewWindow";
import useAuth from "../../hooks/useAuth";

const ManageInterviews = () => {
  const { user } = useAuth();

  const [slots, setSlots] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [position, setPosition] = useState("");
  const [questions, setQuestions] = useState("");

  const loadSlots = () => {
    if (!user) return;
    interviewApi.getTrainerInterviews(user.id)
      .then((data) => setSlots(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadSlots();
  }, [user]);

  const createSlot = async () => {
    if (!slotDate || !slotTime || !position) {
      alert("Please fill all required fields.");
      return;
    }

    const dateTime = new Date(`${slotDate}T${slotTime}`).toISOString();

    const payload = {
      trainerId: user.id,
      dateTime,
      position,
      questions,
    };

    try {
      await interviewApi.createSlot(payload);
      alert("Slot Created Successfully!");

      setSlotDate("");
      setSlotTime("");
      setPosition("");
      setQuestions("");
      setShowForm(false);

      loadSlots();
    } catch (error) {
      console.log(error);
      alert("Failed to create slot.");
    }
  };

  return (
    <div className="page trainer-manage-interviews">

      {/* PAGE HEADER */}
      <div className="page-header">
        <h2>Manage Interviews</h2>
        <button className="create-slot-btn" onClick={() => setShowForm(true)}>
          + Create Slot
        </button>
      </div>

      {/* MODAL */}
      {showForm && (
        <>
          <div className="modal-overlay" onClick={() => setShowForm(false)}></div>

          <div className="modal-container">
            <h2>Create New Interview Slot</h2>

            <label>Date *</label>
            <input
              type="date"
              value={slotDate}
              onChange={(e) => setSlotDate(e.target.value)}
            />

            <label>Time *</label>
            <input
              type="time"
              value={slotTime}
              onChange={(e) => setSlotTime(e.target.value)}
            />

            <label>Position *</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            >
              <option value="">Select Position</option>
              <option value="HR Interview">HR Interview</option>
              <option value="Technical Interview">Technical Interview</option>
              <option value="Domain-Specific">Domain-Specific</option>
            </select>

            <label>Optional Questions / Notes</label>
            <textarea
              placeholder="Enter notes..."
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
            ></textarea>

            <div className="modal-buttons">
              <button className="btn btn-primary" onClick={createSlot}>Create Slot</button>
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Close</button>
            </div>
          </div>
        </>
      )}

      {/* SLOT LIST */}
      <h3>Your Scheduled Slots</h3>

      {slots.length === 0 ? (
        <p>No interviews scheduled yet.</p>
      ) : (
        slots.map((slot) => (
          <div key={slot.id} className="card slot-card">
            <p><b>Date:</b> {new Date(slot.dateTime).toLocaleString()}</p>
            <p><b>Position:</b> {slot.position}</p>
            <p><b>Student:</b> {slot.studentName || "Not Booked"}</p>

            <button
              className="btn"
              onClick={() => setSelectedInterview(slot.id)}
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

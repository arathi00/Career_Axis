import React, { useEffect, useState } from "react";
import {
  getTrainerSlots,
  createInterviewSlot,
  getTrainerNotifications,
  submitFeedback
} from "../../api/interviewApi";
import InterviewWindow from "../../components/UI/InterviewWindow";
import FeedbackModal from "../../components/Trainer/FeedbackModal";
import useAuth from "../../hooks/useAuth";
import { useLocation } from "react-router-dom";

const ManageInterviews = () => {
  const auth = useAuth();
  const user = auth?.user;

  const location = useLocation(); // ✅ ADDED

  const [slots, setSlots] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [position, setPosition] = useState("");
  const [notes, setNotes] = useState("");

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackInterviewId, setFeedbackInterviewId] = useState(null);

  const loadSlots = () => {
    if (!user) return;

    getTrainerSlots()
      .then((data) => setSlots(data))
      .catch((err) => console.error(err));
  };

  const loadNotifications = () => {
    if (!user) return;

    getTrainerNotifications()
      .then((data) => setNotifications(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadSlots();
    loadNotifications();
  }, [user]);

  // ✅ NEW: Auto open modal if coming from Dashboard
  useEffect(() => {
    if (location.state?.feedbackId) {
      openFeedbackModal(location.state.feedbackId);
    }
  }, [location.state]);

  const openFeedbackModal = (interviewId) => {
    setFeedbackInterviewId(interviewId);
    setShowFeedbackModal(true);
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
    setFeedbackInterviewId(null);
  };

  const handleFeedbackSubmit = async (interviewId, data) => {
    await submitFeedback(interviewId, data);
  };

  const createSlot = async () => {
    if (!slotDate || !slotTime || !position) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      date: slotDate,
      time: slotTime,
      position,
      notes,
    };

    try {
      await createInterviewSlot(payload);
      alert("Slot Created Successfully!");

      setSlotDate("");
      setSlotTime("");
      setPosition("");
      setNotes("");
      setShowForm(false);

      loadSlots();
    } catch (error) {
      console.error(error);
      alert("Failed to create slot.");
    }
  };

  return (
    <div className="page trainer-manage-interviews">
      <div className="page-header">
        <h2>Manage Interviews</h2>
        <button className="create-slot-btn" onClick={() => setShowForm(true)}>
          + Create Slot
        </button>
      </div>

      <div className="notifications-panel">
        <h3>Notifications</h3>
        <button onClick={loadNotifications} className="btn-refresh">
          Refresh
        </button>
        {notifications.length === 0 && <div>No notifications</div>}
        {notifications.map((n) => (
          <div key={n.id} className="notification-item">
            <div className="message">{n.message}</div>
            <div className="meta">
              {new Date(n.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setShowForm(false)}
          ></div>

          <div className="modal-container">
            <h3>Create New Interview Slot</h3>

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
              <option value="Domain-Specific Interview">
                Domain-Specific Interview
              </option>
            </select>

            <label>Optional Notes</label>
            <textarea
              placeholder="Enter notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>

            <div className="modal-buttons">
              <button className="btn btn-primary" onClick={createSlot}>
                Create Slot
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}

      {slots.map((slot) => (
        <div key={slot.id} className="slot-card">
          <div><b>Date:</b> {slot.date}</div>
          <div><b>Time:</b> {slot.time}</div>
          <div><b>Position:</b> {slot.position}</div>
          <div><b>Status:</b> {slot.status || "available"}</div>

          {slot.student ? (
            <>
              <div className="student-info">
                <h4>Booked By</h4>
                <div><b>Name:</b> {slot.student.name}</div>
                <div><b>Email:</b> {slot.student.email}</div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => openFeedbackModal(slot.id)}
              >
                Give Feedback
              </button>
            </>
          ) : (
            <div>No student booked yet</div>
          )}
        </div>
      ))}

      {selectedInterview && (
        <InterviewWindow
          interviewId={selectedInterview}
          role="trainer"
          onEnd={() => setSelectedInterview(null)}
        />
      )}

      {showFeedbackModal && (
        <FeedbackModal
          interviewId={feedbackInterviewId}
          onClose={closeFeedbackModal}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
};

export default ManageInterviews;
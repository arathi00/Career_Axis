import React, { useEffect, useState } from "react";
import {
  getAvailableSlots,
  bookSlot,
  getMyInterviews
} from "../../../api/interviewApi";
import "@/styles/interview.css";

const InterviewList = () => {
  const [activeTab, setActiveTab] = useState("booked");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedInterviews, setBookedInterviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 format time (remove microseconds)
  const formatTime = (t) => (t ? t.split(".")[0] : "");

  const loadData = async () => {
    try {
      const [available, booked] = await Promise.all([
        getAvailableSlots(),
        getMyInterviews()
      ]);

      const uniqueBooked = Array.from(
        new Map(booked.map((i) => [i.id, i])).values()
      );

      setAvailableSlots(available);
      setBookedInterviews(uniqueBooked);
    } catch (err) {
      console.error("Failed to load interviews", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBook = async (id) => {
    setLoading(true);
    try {
      await bookSlot(id);
      await loadData();
      setActiveTab("booked");
    } catch (err) {
      alert("Failed to book interview");
    } finally {
      setLoading(false);
    }
  };

const isFutureSlot = (date, time) => {
  const slotDateTime = new Date(`${date}T${time}`);
  return slotDateTime > new Date();
};

  return (
    <div className="page-container">
      <h2>Mock Interviews</h2>

      {/* ================= TABS ================= */}
      <div className="interview-tabs">
        <button
          className={activeTab === "booked" ? "active" : ""}
          onClick={() => setActiveTab("booked")}
        >
          My Interviews
        </button>

        <button
          className={activeTab === "available" ? "active" : ""}
          onClick={() => setActiveTab("available")}
        >
          Available Slots
        </button>
      </div>

      {/* ================= BOOKED INTERVIEWS ================= */}
{activeTab === "booked" && (
  <>
    {bookedInterviews.filter((i) =>
      isFutureSlot(i.date, i.time)
    ).length === 0 ? (
      <p className="muted">
        You have no upcoming booked interviews.
      </p>
    ) : (
      <div className="card-grid">
        {bookedInterviews
          .filter((i) => isFutureSlot(i.date, i.time))
          .map((i) => (
            <div key={i.id} className="interview-card">
              {/* ✅ Interview title from backend */}
              <h3>{i.position || "Mock Interview"}</h3>

              <p><b>Date:</b> {i.date}</p>
              <p><b>Time:</b> {formatTime(i.time)}</p>

              {/* ✅ Trainer name from backend */}
              <p>
                <b>Trainer:</b>{" "}
                {i.trainer_name || "Assigned Trainer"}
              </p>

              {i.join_link ? (
                <a
                  href={i.join_link}
                  target="_blank"
                  rel="noreferrer"
                  className="primary-btn"
                >
                  Join Interview
                </a>
              ) : (
                <button className="secondary-btn" disabled>
                  Link not available
                </button>
              )}
            </div>
          ))}
      </div>
    )}
  </>
)}


      {/* ================= AVAILABLE SLOTS (FIXED) ================= */}
{activeTab === "available" && (
  <>
    {availableSlots.filter((slot) =>
      isFutureSlot(slot.date, slot.time)
    ).length === 0 ? (
      <p className="muted">No upcoming interview slots available.</p>
    ) : (
      <div className="card-grid">
        {availableSlots
          .filter((slot) => isFutureSlot(slot.date, slot.time))
          .map((slot) => (
            <div key={slot.id} className="interview-card">
              <h3>{slot.position || "Interview Slot"}</h3>

              <p><b>Date:</b> {slot.date}</p>
              <p><b>Time:</b> {formatTime(slot.time)}</p>

              <p>
                <b>Trainer:</b>{" "}
                {slot.trainer_name || "Assigned Trainer"}
              </p>

              <button
                className="primary-btn"
                disabled={loading}
                onClick={() => handleBook(slot.id)}
              >
                {loading ? "Booking..." : "Book Slot"}
              </button>
            </div>
          ))}
      </div>
    )}
  </>
)}

    </div>
  );
};

export default InterviewList;

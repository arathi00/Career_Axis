// src/pages/Student/Interview/InterviewList.jsx
import React, { useEffect, useState } from "react";
import interviewApi from "../../../api/interviewApi";
import SlotCard from "../../../components/UI/SlotCard";
import useAuth from "../../../hooks/useAuth"; // FIXED HERE

const InterviewList = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // now works correctly

  useEffect(() => {
    interviewApi.getSlots()
      .then(setSlots)
      .finally(() => setLoading(false));
  }, []);

  const book = async (slotId) => {
    try {
      await interviewApi.bookSlot(slotId);
      alert("Interview booked successfully!");
      setSlots(prev => prev.filter(s => s.id !== slotId));
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="page interview-list-page">
      <h2>Mock Interview - Book a Slot</h2>
      {loading ? <p>Loading...</p> : (
        <>
          {slots.length === 0 && <p>No slots available right now.</p>}
          <div className="slots-grid">
            {slots.map(slot => (
              <SlotCard key={slot.id} slot={slot} onBook={book} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default InterviewList;

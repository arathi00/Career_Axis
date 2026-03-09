// src/components/UI/SlotCard.jsx
import React from "react";

const SlotCard = ({ slot, onBook, showBook = true }) => {
  const start = new Date(slot.dateTime);
  const label = start.toLocaleString();

  return (
    <div className="slot-card card">
      <div className="slot-info">
        <div className="slot-time">{label}</div>
        <div className="slot-meta">{slot.trainerName ? `Trainer: ${slot.trainerName}` : "Open slot"}</div>
      </div>
      {showBook && (
        <button className="btn btn-primary" onClick={() => onBook(slot.id)}>
          Book
        </button>
      )}
    </div>
  );
};

export default SlotCard;

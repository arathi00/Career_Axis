const InterviewEmpty = ({ type }) => {
  return (
    <div className="empty-state">
      <p>
        {type === "upcoming"
          ? "No upcoming interviews scheduled."
          : "No past interviews available."}
      </p>
    </div>
  );
};

export default InterviewEmpty;

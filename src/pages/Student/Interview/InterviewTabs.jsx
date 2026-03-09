const InterviewTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="interview-tabs">
      <button
        className={activeTab === "upcoming" ? "active" : ""}
        onClick={() => setActiveTab("upcoming")}
      >
        Upcoming
      </button>

      <button
        className={activeTab === "past" ? "active" : ""}
        onClick={() => setActiveTab("past")}
      >
        Past
      </button>
    </div>
  );
};

export default InterviewTabs;

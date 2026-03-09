import React, { useState, useEffect } from "react";
import {
  getTrainerSlots,
  getAssignedStudents,
  getPastInterviews,
  submitFeedback
} from "../../api/interviewApi";
import AssignedStudentCard from "../../components/Trainer/AssignedStudentCard";
import InterviewItem from "../../components/Trainer/InterviewItem";
import FeedbackModal from "../../components/Trainer/FeedbackModal";
import "../../styles/TrainerDashboard.css";
import { useNavigate } from "react-router-dom";

const TrainerDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Interviews");
  const [search, setSearch] = useState("");

  const [stats, setStats] = useState({
    interviewsToday: 0,
    pendingInterviews: 0,
    completedInterviews: 0,
    assignedStudentsCount: 0,
  });

  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [pastInterviews, setPastInterviews] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);

  /* GREETING */
  const trainerName = "Trainer";
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  useEffect(() => {
    let mounted = true;

    // Load upcoming interviews
    getTrainerSlots()
      .then((data) => {
        if (!mounted) return;

        if (!Array.isArray(data)) {
          setUpcomingInterviews([]);
          return;
        }

        const bookedInterviews = data.filter(
          (i) => i?.status === "scheduled"
        );

        setUpcomingInterviews(bookedInterviews);

        setStats((prev) => ({
          ...prev,
          interviewsToday: bookedInterviews.length,
          pendingInterviews: bookedInterviews.length,
        }));
      })
      .catch(() => setUpcomingInterviews([]));

    // Load assigned students
    getAssignedStudents()
      .then((data) => {
        if (!mounted) return;

        if (!Array.isArray(data)) {
          setAssignedStudents([]);
          return;
        }

        setAssignedStudents(data);

        setStats((prev) => ({
          ...prev,
          assignedStudentsCount: data.length,
        }));
      })
      .catch(() => setAssignedStudents([]));

    // Load past interviews
    getPastInterviews()
      .then((data) => {
        if (!mounted) return;

        if (Array.isArray(data)) {
          setPastInterviews(data);

          setStats((prev) => ({
            ...prev,
            completedInterviews: data.length,
          }));
        } else {
          setPastInterviews([]);
        }
      })
      .catch(() => setPastInterviews([]));

    return () => {
      mounted = false;
    };
  }, []);

  const filteredAssigned = assignedStudents.filter((s) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    return (
      s.name?.toLowerCase().includes(q) ||
      (s.email && s.email.toLowerCase().includes(q))
    );
  });

  // ✅ HANDLE FEEDBACK SUBMIT
  const handleFeedbackSubmit = async (interviewId, data) => {
    await submitFeedback(interviewId, data);

    setShowFeedbackModal(false);

    // Reload past interviews after submitting feedback
    const updated = await getPastInterviews();
    setPastInterviews(updated);
  };

  return (
    <div className="trainer-dashboard-style">
      {/* HEADER */}
      <h1 className="trainer-title">
        {greeting}, {trainerName} 👋
      </h1>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card" style={{ "--bg": "#eaf1ff", "--color": "#3b82f6" }}>
          <p className="stat-title">Interviews Today</p>
          <h3 className="stat-value">{stats.interviewsToday}</h3>
        </div>

        <div className="stat-card" style={{ "--bg": "#fff3e6", "--color": "#fb923c" }}>
          <p className="stat-title">Pending</p>
          <h3 className="stat-value">{stats.pendingInterviews}</h3>
        </div>

        <div className="stat-card" style={{ "--bg": "#e9f8ee", "--color": "#10b981" }}>
          <p className="stat-title">Completed</p>
          <h3 className="stat-value">{stats.completedInterviews}</h3>
        </div>

        <div className="stat-card" style={{ "--bg": "#f4eaff", "--color": "#a855f7" }}>
          <p className="stat-title">Assigned Students</p>
          <h3 className="stat-value">{stats.assignedStudentsCount}</h3>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs-row">
        {["Interviews", "Assigned Students", "Past Interviews"].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}

        <button className="tab" onClick={() => navigate("/trainer/interviews")}>
          Manage Interviews
        </button>
      </div>

      {/* SEARCH */}
      {activeTab === "Assigned Students" && (
        <div className="searchbar">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assigned students by name or email..."
          />
          <button className="filter-btn">Search</button>
        </div>
      )}

      {/* UPCOMING INTERVIEWS */}
      {activeTab === "Interviews" && (
        <div className="tab-card card">
          <h3>Upcoming Interviews</h3>
          {upcomingInterviews.length === 0 ? (
            <p className="muted">No upcoming interviews assigned to you.</p>
          ) : (
            upcomingInterviews.map((it) => (
              <InterviewItem key={it.id} interview={it} />
            ))
          )}
        </div>
      )}

      {/* ASSIGNED STUDENTS */}
      {activeTab === "Assigned Students" && (
        <div className="student-list">
          {filteredAssigned.length === 0 ? (
            <div className="card tab-card">No assigned students found.</div>
          ) : (
            filteredAssigned.map((s) => (
              <AssignedStudentCard key={s.id} student={s} />
            ))
          )}
        </div>
      )}

      {/* PAST INTERVIEWS */}
      {activeTab === "Past Interviews" && (
        <div className="tab-card card">
          <h3>Past Interviews</h3>

          {pastInterviews.length === 0 ? (
            <p className="muted">No past interviews available.</p>
          ) : (
            pastInterviews.map((p) => {
              const hasFeedback =
                p.score !== null &&
                p.score !== undefined &&
                p.feedback !== null &&
                p.feedback !== undefined;

              return (
                <div key={p.id} className="past-card">
                  <div className="past-header">
                    <div className="past-left">
                      <div className="avatar">
                        {(p.student_name || "NA")
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                  </div>

                  <div>
                    <div className="student-name">{p.student_name}</div>
                    <div className="past-date">{p.date}</div>
                    <div className="interview-type">{p.position}</div>
                  </div>
                </div>

                {p.score != null && (
      <div className="score-badge">
        {p.score}
      </div>
    )}
  </div>

                   {p.feedback && (
    <div className="feedback-box">
      {p.feedback}
    </div>
  )}

  {p.score == null && (
    <button
      className="feedback-btn"
      onClick={() => {
        setSelectedInterviewId(p.id);
        setShowFeedbackModal(true);
      }}
    >
      Give Feedback
    </button>
  )}
</div>
              );
            })
          )}
        </div>
      )}

      {/* ✅ MODAL RENDERED HERE */}
      {showFeedbackModal && (
        <FeedbackModal
          interviewId={selectedInterviewId}
          onClose={() => setShowFeedbackModal(false)}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
};

export default TrainerDashboard;
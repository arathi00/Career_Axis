const StudentCard = ({ s }) => {
  const initials = s.name.split(" ").map(w => w[0]).join("");

  return (
    <div className="student-card">
      <div className="student-left">
        <div className="avatar">{initials}</div>

        <div>
          <h4 className="student-name">
            {s.name}
            <span className="badge excellent">Excellent</span>
          </h4>
          <p className="student-email">{s.email}</p>
          <p className="student-current">Current: {s.current}</p>
        </div>
      </div>

      <div className="student-right">
        <p className="last-active">{s.lastActive}</p>
        <p className="progress-text">{s.progress}%</p>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${s.progress}%` }}></div>
        </div>

        <p className="modules-count">{s.modulesCompleted}/{s.modulesTotal} modules</p>

        <button className="view-btn">View Details</button>
      </div>
    </div>
  );
};

export default StudentCard;

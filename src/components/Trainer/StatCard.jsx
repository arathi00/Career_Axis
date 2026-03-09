const StatCard = ({ title, value, icon }) => {
  return (
    <div className="stat-card">
      <div>
        <p className="stat-title">{title}</p>
        <h3 className="stat-value">{value}</h3>
      </div>
      <div className="stat-icon">{icon}</div>
    </div>
  );
};

export default StatCard;

const Tabs = ({ tabs, active, onChange }) => {
  return (
    <div className="tabs">
      {tabs.map(t => (
        <button 
          key={t}
          className={`tab ${active === t ? "active" : ""}`}
          onClick={() => onChange(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
};

export default Tabs;

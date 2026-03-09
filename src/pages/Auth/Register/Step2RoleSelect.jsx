const Step2RoleSelect = ({ data, setData, next, back }) => {
  return (
    <div className="register-card">
      <h2>Select Your Role</h2>

      <div className="register-grid">
        <div
          className="form-column"
          style={{
            border: data.role === "student" ? "2px solid #4f46e5" : "1.5px solid #e5e7eb",
            borderRadius: "14px",
            padding: "24px",
            cursor: "pointer",
          }}
          onClick={() => setData({ ...data, role: "student" })}
        >
          <h3 style={{ color: "#4f46e5" }}>Student</h3>
          <p>Access quizzes, resume builder, mock interviews and analytics.</p>
        </div>

        <div
          className="form-column"
          style={{
            border: data.role === "trainer" ? "2px solid #7e22ce" : "1.5px solid #e5e7eb",
            borderRadius: "14px",
            padding: "24px",
            cursor: "pointer",
          }}
          onClick={() => setData({ ...data, role: "trainer" })}
        >
          <h3 style={{ color: "#7e22ce" }}>Trainer</h3>
          <p>Conduct interviews, upload quizzes (admin approval required).</p>
        </div>
      </div>

      <div className="register-btn">
        <button className="btn-secondary" onClick={back}>Back</button>
        <button className="btn-primary" disabled={!data.role} onClick={next}>Next</button>
      </div>
    </div>
  );
};

export default Step2RoleSelect;

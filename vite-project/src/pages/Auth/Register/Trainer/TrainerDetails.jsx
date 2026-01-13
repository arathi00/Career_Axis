import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../../api/authApi";
import { useState } from "react";

const TrainerDetails = ({ data, setData, back }) => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    setError("");
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        qualification: data.qualification,
        designation: data.designation,
        expertise: data.expertise,
        experience: data.experience,
        organization: data.organization,
      };

      await registerUser(payload);
      alert("Registration successful. Redirecting to login...");
      navigate("/login");
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Registration failed";
      setError(msg);
    }
  };

  return (
    <div className="register-card">
      <h2>Trainer Details</h2>

      <div className="register-grid">
        <div className="form-column">
          <input name="qualification" placeholder="Qualification" onChange={handleChange} />
          <input name="designation" placeholder="Designation" onChange={handleChange} />
          <input name="expertise" placeholder="Expertise Area" onChange={handleChange} />
        </div>

        <div className="form-column">
          <input name="experience" placeholder="Experience (Years)" onChange={handleChange} />
          <input name="organization" placeholder="Institution / Organization" onChange={handleChange} />
        </div>
      </div>

      <p style={{ color: "#dc2626", marginTop: "10px" }}>
        Trainer accounts require admin approval.
      </p>

      <div className="register-btn">
        <button className="btn-secondary" onClick={back}>Back</button>
        <button className="btn-primary" onClick={handleRegister}>Register</button>
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default TrainerDetails;

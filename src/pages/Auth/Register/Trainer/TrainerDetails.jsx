import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../../api/authApi";

const TrainerDetails = ({ data, setData, back }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const validateAndSubmit = async () => {
    const newErrors = {};

    if (!data.qualification) newErrors.qualification = "Qualification is required";
    if (!data.designation) newErrors.designation = "Designation is required";
    if (!data.expertise) newErrors.expertise = "Expertise area is required";
    if (!data.experience) newErrors.experience = "Experience is required";
    else if (isNaN(Number(data.experience))) newErrors.experience = "Experience must be a number";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      // send full form data to backend
      await registerUser(data);
      alert("Registration submitted. Trainer approval is required. Please login after approval.");
      navigate("/login");
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Registration failed";
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-card">
      <h2>Trainer Details</h2>

      <div className="register-grid">
        <div className="form-column">
          <input
            name="qualification"
            placeholder="Qualification"
            value={data.qualification}
            onChange={handleChange}
          />
          {errors.qualification && <p className="error-text">{errors.qualification}</p>}

          <input
            name="designation"
            placeholder="Designation"
            value={data.designation}
            onChange={handleChange}
          />
          {errors.designation && <p className="error-text">{errors.designation}</p>}

          <input
            name="expertise"
            placeholder="Expertise Area"
            value={data.expertise}
            onChange={handleChange}
          />
          {errors.expertise && <p className="error-text">{errors.expertise}</p>}
        </div>

        <div className="form-column">
          <input
            name="experience"
            placeholder="Experience (Years)"
            value={data.experience}
            onChange={handleChange}
          />
          {errors.experience && <p className="error-text">{errors.experience}</p>}

          <input
            name="organization"
            placeholder="Institution / Organization"
            value={data.organization}
            onChange={handleChange}
          />
        </div>
      </div>

      <p style={{ color: "#dc2626", marginTop: "10px" }}>
        Trainer accounts require admin approval.
      </p>

      {errors.submit && <p className="error-text">{errors.submit}</p>}

      <div className="register-btn">
        <button className="btn-secondary" onClick={back} disabled={loading}>
          Back
        </button>
        <button className="btn-primary" onClick={validateAndSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Register"}
        </button>
      </div>
    </div>
  );
};

export default TrainerDetails;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../../api/authApi";


const StudentLinks = ({ data, setData, back }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  /* ---------- VALIDATION ---------- */
  const validateAndSubmit = async () => {
    const newErrors = {};

    // GitHub validation
    if (data.github && !data.github.startsWith("https://github.com/")) {
      newErrors.github = "GitHub URL must start with https://github.com/";
    }

    // LinkedIn validation
    if (
      data.linkedin &&
      !data.linkedin.startsWith("https://www.linkedin.com/")
    ) {
      newErrors.linkedin =
        "LinkedIn URL must start with https://www.linkedin.com/";
    }

    // Portfolio validation (generic URL)
    if (
      data.portfolio &&
      !/^https?:\/\/.+\..+/.test(data.portfolio)
    ) {
      newErrors.portfolio = "Enter a valid website URL";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);
        const payload = { ...data };
        // backend doesn't need confirmPassword field
        delete payload.confirmPassword;

        await registerUser(payload);
        alert("Registration successful. Please login.");
        navigate("/login");
      } catch (err) {
        const msg = err?.response?.data?.detail || err?.message || "Registration failed";
        setErrors({ submit: msg });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="register-card">
      <h2>Professional Links</h2>

      <div className="register-grid">
        <div className="form-column">
          <input
            name="github"
            placeholder="GitHub Profile URL"
            value={data.github}
            onChange={handleChange}
          />
          {errors.github && <p className="error-text">{errors.github}</p>}

          <input
            name="linkedin"
            placeholder="LinkedIn Profile URL"
            value={data.linkedin}
            onChange={handleChange}
          />
          {errors.linkedin && <p className="error-text">{errors.linkedin}</p>}

          <input
            name="portfolio"
            placeholder="Portfolio Website (optional)"
            value={data.portfolio}
            onChange={handleChange}
          />
          {errors.portfolio && (
            <p className="error-text">{errors.portfolio}</p>
          )}
        </div>
      </div>

      <div className="register-btn">
        <button className="btn-secondary" onClick={back} disabled={loading}>
          Back
        </button>
        <button className="btn-primary" onClick={validateAndSubmit} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
      {errors.submit && <p className="error-text">{errors.submit}</p>}
    </div>
  );
};

export default StudentLinks;

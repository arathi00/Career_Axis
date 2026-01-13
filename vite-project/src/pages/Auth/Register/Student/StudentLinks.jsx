import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../../api/authApi";

const StudentLinks = ({ data, setData, back }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  /* ---------- VALIDATION ---------- */
  const navigate = useNavigate();

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
        const payload = {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          university: data.university,
          college: data.college,
          course: data.course,
          branch: data.branch,
          currentYear: data.currentYear,
          graduationYear: data.graduationYear,
          cgpa: data.cgpa,
          skills: data.skills,
          github: data.github,
          linkedin: data.linkedin,
          portfolio: data.portfolio,
        };

        await registerUser(payload);
        alert("Registration successful. Redirecting to login...");
        navigate("/login");
      } catch (err) {
        const msg = err?.response?.data?.detail || err?.message || "Registration failed";
        setErrors({ api: msg });
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
        <button className="btn-secondary" onClick={back}>
          Back
        </button>
        <button className="btn-primary" onClick={validateAndSubmit}>
          Register
        </button>
      </div>
      {errors.api && <p className="error-text">{errors.api}</p>}
    </div>
  );
};

export default StudentLinks;

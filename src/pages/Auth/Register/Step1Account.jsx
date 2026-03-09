import { useState } from "react";

const Step1Account = ({ data, setData, next }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  /* ---------- VALIDATION ---------- */
  const validateAndNext = () => {
    const newErrors = {};

    if (!data.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!data.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!data.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      next();
    }
  };

  return (
    <div className="register-card">
      <h2>Create Account</h2>

      <div className="register-grid">
        <div className="form-column">
          <input
            name="name"
            placeholder="Full Name"
            value={data.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={data.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={data.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className="error-text">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      <div className="register-btn">
        <button className="btn-primary" onClick={validateAndNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Step1Account;

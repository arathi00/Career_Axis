import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, getProfile } from "../../api/authApi";
import Button from "../../components/UI/Button";
import "../../styles/login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔒 If already logged in, redirect based on role
  useEffect(() => {
    const token = localStorage.getItem("access");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "student") navigate("/student/dashboard", { replace: true });
      else if (role === "trainer") navigate("/trainer/dashboard", { replace: true });
      else navigate("/admin/dashboard", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 🔥 clear old state
      localStorage.clear();
      sessionStorage.clear();

      const res = await loginUser({ email, password });
      // res contains: access_token, role

      // ✅ SAVE AUTH DATA
      localStorage.setItem("access", res.access_token);
      localStorage.setItem("role", res.role);
      
      // Store refresh token if provided
      if (res.refresh_token) {
        localStorage.setItem("refresh", res.refresh_token);
      }

      // ✅ FETCH USER PROFILE
      try {
        const userProfile = await getProfile();
        localStorage.setItem("user", JSON.stringify(userProfile));
      } catch (profileErr) {
        console.warn("Failed to fetch user profile", profileErr);
        // Continue anyway with just token and role
      }

      // ✅ ROLE-BASED REDIRECT
      if (res.role === "student") navigate("/student/dashboard");
      else if (res.role === "trainer") navigate("/trainer/dashboard");
      else navigate("/admin/dashboard");

    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        err?.detail ||
        "Invalid email or password"
      );
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <span className="brand-name">Career Axis</span>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <p className="error-text">{error}</p>}

          <div className="input-group">
            <input
              type="email"
              className="input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              className="input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Password</label>
          </div>

          <Button type="submit">Login</Button>

          <div className="signup">
            Don&apos;t have an account? <a href="/register">Sign Up</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

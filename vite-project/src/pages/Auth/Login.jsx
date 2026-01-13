import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import Button from "../../components/UI/Button";
import "../../styles/login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔒 If already logged in, redirect based on role
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "student") navigate("/student/dashboard");
      else if (role === "trainer") navigate("/trainer/dashboard");
      else navigate("/admin/dashboard");
    }
  }, [navigate]);

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
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("role", res.role);

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

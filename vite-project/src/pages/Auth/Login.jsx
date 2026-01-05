import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import Button from "../../components/UI/Button";
import "../../styles/login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 🔹 loginUser already returns response.data
      const res = await loginUser({ email, password });

      const { access_token, token_type, user } = res;

      // ✅ Store JWT & user
      localStorage.setItem("token", access_token);
      localStorage.setItem("token_type", token_type);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Login successful:", user);

      // ✅ Role-based redirect
      if (user.role === "student") {
        navigate("/student/dashboard");
      } else if (user.role === "trainer") {
        navigate("/trainer/dashboard");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        err?.detail ||
        "Login failed"
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

import React, { useState } from 'react';
import { loginUser } from '../../api/authApi';
import Button from '../../components/UI/Button';
import '../../styles/login.css';
import Input from '../../components/UI/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      console.log(res.data);
      // Handle successful login (e.g., redirect, store token)
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <span className="brand-name">Career Axis</span>
        <form className="login-form" onSubmit={handleSubmit}>
          
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

          <div className="form-row">
            <div className="remember">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot">Forgot password?</a>
          </div>

          <Button type="submit">Login</Button>

          <div className="signup">
            Don't have an account? <a href="/register">Sign Up</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

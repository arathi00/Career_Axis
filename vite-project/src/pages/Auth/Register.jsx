import React, { useState } from 'react';
import { registerUser } from '../../api/authApi';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import '../../styles/login.css'; // Reuse the same improved CSS

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const res = await registerUser({ name, email, password });
      console.log(res.data);
      alert('Registration successful!');
      // Optionally redirect to login page
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <span className="brand-name">Register</span>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="text"
              className="input"
              placeholder=" "
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label>Name</label>
          </div>

          <div className="input-group">
            <input
              type="email"
              className="input"
              placeholder=" "
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
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Password</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              className="input"
              placeholder=" "
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <label>Confirm Password</label>
          </div>

          <Button type="submit">Register</Button>

          <p className="signup">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;

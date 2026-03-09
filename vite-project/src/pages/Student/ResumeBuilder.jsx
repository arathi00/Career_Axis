import React, { useState } from "react";
import "../../styles/resume.css"; // Import CSS

function ResumeBuilder() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    skills: "",
    education: "",
    experience: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="resume-builder-container">

      <h1 className="page-title">Resume Builder</h1>
      <p className="page-subtitle">Fill your professional details</p>

      <div className="resume-form-card">

        <div className="form-group">
          <label>Full Name</label>
          <input name="fullName" placeholder="John Doe" onChange={handleChange} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input name="email" placeholder="example@email.com" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input name="phone" placeholder="9876543210" onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>Skills</label>
          <textarea name="skills" placeholder="JavaScript, React, Python..." onChange={handleChange}></textarea>
        </div>

        <div className="form-group">
          <label>Education</label>
          <textarea name="education" placeholder="B.Tech CSE, XYZ University..." onChange={handleChange}></textarea>
        </div>

        <div className="form-group">
          <label>Experience</label>
          <textarea name="experience" placeholder="Intern at ABC Company..." onChange={handleChange}></textarea>
        </div>

        <button className="generate-btn">Save Resume</button>
      </div>
    </div>
  );
}

export default ResumeBuilder;

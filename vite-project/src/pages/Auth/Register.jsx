import React, { useState } from 'react';
import { registerUser } from '../../api/authApi';
import Button from '../../components/UI/Button';
import '../../styles/Register.css';

/* ALL ENGINEERING SKILLS – COMMON POOL (NO BRANCH FILTERING) */
const SKILL_SUGGESTIONS = [
  'C','C++','Java','Python','JavaScript',
  'Data Structures','Algorithms','Object Oriented Programming',
  'Problem Solving','Logical Reasoning',
  'HTML','CSS','Frontend Development','Backend Development',
  'Full Stack Development','React','Node.js','Django','FastAPI',
  'REST API Development',
  'SQL','MySQL','PostgreSQL','MongoDB','Database Design',
  'Operating Systems','Computer Networks','Linux Basics','Network Security',
  'Cloud Computing','AWS Basics','Azure Basics','DevOps','CI/CD Pipelines',
  'Docker','Kubernetes',
  'Machine Learning','Deep Learning','Artificial Intelligence',
  'Data Analysis','Computer Vision','Natural Language Processing',
  'Cyber Security','IoT Fundamentals','Embedded Systems',
  'Microcontrollers','Sensors & Actuators',
  'Analog Electronics','Digital Electronics','Signals and Systems',
  'Communication Systems','VLSI Basics','PCB Design',
  'Electrical Circuits','Network Theory','Electrical Machines',
  'Power Systems','Power Electronics','Control Systems','PLC','SCADA',
  'Engineering Mechanics','Strength of Materials','Theory of Machines',
  'Machine Design','Fluid Mechanics','Heat Transfer',
  'Manufacturing Processes','CNC Machines','Quality Control',
  'Robotics Kinematics','Dynamics and Control','ROS','Automation',
  'Industrial Robotics',
  'MATLAB','Simulink','ANSYS','AutoCAD','SolidWorks','CATIA',
  'Git','GitHub','Version Control','Debugging',
  'Technical Documentation','Presentation Skills','Team Collaboration'
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    college: '',
    course: '',
    branch: '',
    currentYear: '',
    graduationYear: '',
    cgpa: ''
  });

  const [errors, setErrors] = useState({});
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);

  const validateGraduationYear = (year) => {
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 6;
    const maxYear = currentYear + 2;

    if (!/^\d{4}$/.test(year)) {
      return "Graduation year must be a 4-digit number";
    }
    if (year < minYear || year > maxYear) {
      return `Graduation year must be between ${minYear} and ${maxYear}`;
    }
    return "";
  };

  const validateCGPA = (cgpa) => {
    if (!/^\d+(\.\d{1,2})?$/.test(cgpa)) {
      return "CGPA must be a valid number";
    }
    const value = parseFloat(cgpa);
    if (value < 0 || value > 10) {
      return "CGPA must be between 0 and 10";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "graduationYear") {
      setErrors((prev) => ({
        ...prev,
        graduationYear: validateGraduationYear(value),
      }));
    }

    if (name === "cgpa") {
      setErrors((prev) => ({
        ...prev,
        cgpa: validateCGPA(value),
      }));
    }
  };

  const addSkill = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const yearError = validateGraduationYear(formData.graduationYear);
    const cgpaError = validateCGPA(formData.cgpa);

    if (yearError || cgpaError) {
      setErrors({ graduationYear: yearError, cgpa: cgpaError });
      return;
    }

    try {
      await registerUser({ ...formData, skills });
      alert('Registration successful!');
    } catch {
      alert('Registration failed');
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Student Registration</h2>

        <form onSubmit={handleSubmit} className="register-grid">

          {/* Column 1 */}
          <div className="form-column">
            <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />

            <select name="university" value={formData.university} onChange={handleChange} required>
              <option value="">Select University</option>
              <option value="KTU">APJ Abdul Kalam Technological University</option>
            </select>

            <select name="college" value={formData.college} onChange={handleChange} required>
              <option value="">Select College</option>
              <option value="GECI">Government Engineering College Idukki</option>
            </select>
          </div>

          {/* Column 2 */}
          <div className="form-column">
            <select name="course" value={formData.course} onChange={handleChange} required>
              <option value="">Course</option>
              <option>B.Tech</option>
              <option>M.Tech</option>
            </select>

            <select name="branch" value={formData.branch} onChange={handleChange} required>
              <option value="">Branch</option>
              <option>Computer Science Engineering</option>
              <option>Information Technology</option>
              <option>Electronics and Communication Engineering</option>
              <option>Electrical and Electronics Engineering</option>
              <option>Mechanical Engineering</option>
              <option>Robotics and AI Engineering</option>
            </select>

            <select name="currentYear" value={formData.currentYear} onChange={handleChange} required>
              <option value="">Current Year</option>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>

            <input
              name="graduationYear"
              placeholder="Graduation Year"
              maxLength={4}
              value={formData.graduationYear}
              onChange={handleChange}
              required
            />
            {errors.graduationYear && <p className="error-text">{errors.graduationYear}</p>}

            <input
              name="cgpa"
              placeholder="CGPA (0 – 10)"
              value={formData.cgpa}
              onChange={handleChange}
              required
            />
            {errors.cgpa && <p className="error-text">{errors.cgpa}</p>}
          </div>

          {/* Skills */}
          <div className="skills-full">
            <label>Skills</label>

            <input
              placeholder="Type a skill"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
            />

            {skillInput && (
              <div className="skill-suggestions">
                {SKILL_SUGGESTIONS
                  .filter(s =>
                    s.toLowerCase().startsWith(skillInput.toLowerCase()) && 
                    !skills.includes(s)
                  )

                  .map(skill => (
                    <div key={skill} onClick={() => addSkill(skill)}>+ {skill}</div>
                  ))}
              </div>
            )}

            <div className="skill-box">
              {skills.map(skill => (
                <span key={skill} className="skill-chip">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <Button type="submit" className="register-btn">Register</Button>
        </form>
      </div>
    </div>
  );
};

export default Register;

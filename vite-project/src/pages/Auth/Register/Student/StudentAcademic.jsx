import { useState } from "react";

const SKILLS = [
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
  'Cyber Security'
];

const StudentAcademic = ({ data, setData, next, back }) => {
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});

  /* ---------- HANDLE INPUT CHANGE ---------- */
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  /* ---------- SKILLS ---------- */
  const addSkill = (skill) => {
    if (!data.skills.includes(skill)) {
      setData({ ...data, skills: [...data.skills, skill] });
    }
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setData({
      ...data,
      skills: data.skills.filter((s) => s !== skill),
    });
  };

  /* ---------- VALIDATION ---------- */
  const validateAndNext = () => {
    const newErrors = {};

    if (!data.university) newErrors.university = "University is required";
    if (!data.college) newErrors.college = "College is required";
    if (!data.course) newErrors.course = "Course is required";
    if (!data.branch) newErrors.branch = "Branch is required";
    if (!data.currentYear) newErrors.currentYear = "Current year is required";

    if (!data.graduationYear || !/^\d{4}$/.test(data.graduationYear)) {
      newErrors.graduationYear = "Enter valid 4-digit graduation year";
    }

    const cgpaValue = parseFloat(data.cgpa);
    if (isNaN(cgpaValue) || cgpaValue < 0 || cgpaValue > 10) {
      newErrors.cgpa = "CGPA must be between 0 and 10";
    }

    if (data.skills.length < 3) {
      newErrors.skills = "Add at least 3 skills";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      next();
    }
  };

  return (
    <div className="register-card">
      <h2>Academic & Skills Details</h2>

      {/* ----------- ACADEMIC DETAILS ----------- */}
      <div className="register-grid">
        <div className="form-column">
          <select name="university" value={data.university} onChange={handleChange}>
            <option value="">Select University</option>
            <option value="KTU">APJ Abdul Kalam Technological University</option>
          </select>
          {errors.university && <p className="error-text">{errors.university}</p>}

          <select name="college" value={data.college} onChange={handleChange}>
            <option value="">Select College</option>
            <option value="GECI">Government Engineering College Idukki</option>
          </select>
          {errors.college && <p className="error-text">{errors.college}</p>}

          <select name="course" value={data.course} onChange={handleChange}>
            <option value="">Select Course</option>
            <option>B.Tech</option>
            <option>M.Tech</option>
          </select>
          {errors.course && <p className="error-text">{errors.course}</p>}

          <select name="branch" value={data.branch} onChange={handleChange}>
            <option value="">Select Branch</option>
            <option>Computer Science Engineering</option>
            <option>Information Technology</option>
            <option>Electronics and Communication Engineering</option>
            <option>Electrical and Electronics Engineering</option>
            <option>Mechanical Engineering</option>
            <option>Robotics and AI Engineering</option>
          </select>
          {errors.branch && <p className="error-text">{errors.branch}</p>}
        </div>

        <div className="form-column">
          <select name="currentYear" value={data.currentYear} onChange={handleChange}>
            <option value="">Current Year</option>
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
            <option>4th Year</option>
          </select>
          {errors.currentYear && <p className="error-text">{errors.currentYear}</p>}

          <input
            name="graduationYear"
            placeholder="Graduation Year (YYYY)"
            maxLength={4}
            value={data.graduationYear}
            onChange={handleChange}
          />
          {errors.graduationYear && <p className="error-text">{errors.graduationYear}</p>}

          <input
            name="cgpa"
            placeholder="CGPA (0 – 10)"
            value={data.cgpa}
            onChange={handleChange}
          />
          {errors.cgpa && <p className="error-text">{errors.cgpa}</p>}
        </div>
      </div>

      {/* ----------- SKILLS ----------- */}
      <div className="skills-full">
        <label>Skills</label>

        <input
          placeholder="Type a skill and press Enter"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && skillInput.trim()) {
              e.preventDefault();
              addSkill(skillInput.trim());
            }
          }}
        />

        {skillInput && (
          <div className="skill-suggestions">
            {SKILLS.filter((s) =>
              s.toLowerCase().startsWith(skillInput.toLowerCase())
            ).map((skill) => (
              <div key={skill} onClick={() => addSkill(skill)}>
                {skill}
              </div>
            ))}
          </div>
        )}

        <div className="skill-box">
          {data.skills.map((skill) => (
            <span key={skill} className="skill-chip">
              {skill}
              <button onClick={() => removeSkill(skill)}>×</button>
            </span>
          ))}
        </div>

        {errors.skills && <p className="error-text">{errors.skills}</p>}
      </div>

      {/* ----------- BUTTONS ----------- */}
      <div className="register-btn">
        <button className="btn-secondary" onClick={back}>Back</button>
        <button className="btn-primary" onClick={validateAndNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default StudentAcademic;

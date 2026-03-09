import { useState } from "react";

const SKILLS = [
  "C","C++","Java","Python","JavaScript","HTML","CSS","React",
  "Node.js","SQL","MongoDB","PostgreSQL","Data Structures",
  "Algorithms","Computer Networks","Cyber Security"
];

const StudentSkills = ({ data, setData, next, back }) => {
  const [input, setInput] = useState("");

  const addSkill = (skill) => {
    if (!data.skills.includes(skill)) {
      setData({ ...data, skills: [...data.skills, skill] });
    }
    setInput("");
  };

  const removeSkill = (skill) => {
    setData({ ...data, skills: data.skills.filter(s => s !== skill) });
  };

  return (
    <div className="register-card">
      <h2>Skills</h2>

      <input
        placeholder="Type a skill"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addSkill(input)}
      />

      <div className="skill-suggestions">
        {SKILLS.filter(s => s.toLowerCase().startsWith(input.toLowerCase()))
          .map(skill => (
            <div key={skill} onClick={() => addSkill(skill)}>
              {skill}
            </div>
          ))}
      </div>

      <div className="skill-box">
        {data.skills.map(skill => (
          <span key={skill} className="skill-chip">
            {skill}
            <button onClick={() => removeSkill(skill)}>×</button>
          </span>
        ))}
      </div>

      <div className="register-btn">
        <button className="btn-secondary" onClick={back}>Back</button>
        <button className="btn-primary" disabled={data.skills.length < 3} onClick={next}>
          Next
        </button>
      </div>
    </div>
  );
};

export default StudentSkills;

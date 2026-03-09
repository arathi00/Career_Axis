import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../api/authApi";

import Step1Account from "./Step1Account";
import Step2RoleSelect from "./Step2RoleSelect";
import StudentAcademic from "./Student/StudentAcademic";
import StudentLinks from "./Student/StudentLinks";
import TrainerDetails from "./Trainer/TrainerDetails";
import StepProgress from "./StepProgress";

import "../../../styles/Register.css";

const RegisterWizard = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    // STEP 1 – Account
    name: "",
    email: "",
    password: "",
    confirmPassword: "",

    // STEP 2 – Role
    role: "",

    // STEP 3 – Student Academic + Skills
    university: "",
    college: "",
    course: "",
    branch: "",
    currentYear: "",
    graduationYear: "",
    cgpa: "",
    skills: [],

    // STEP 4 – Links
    github: "",
    linkedin: "",
    portfolio: "",

    // Trainer Details
    qualification: "",
    designation: "",
    expertise: "",
    experience: "",
    organization: "",
  });

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  return (
    <div className="register-page">
      <div className="register-card">
        {/* 🔹 STEP PROGRESS BAR (TOP OF CARD) */}
        <StepProgress step={step} role={formData.role} />

        {/* 🔹 STEP 1 – ACCOUNT */}
        {step === 1 && (
          <Step1Account
            data={formData}
            setData={setFormData}
            next={next}
          />
        )}

        {/* 🔹 STEP 2 – ROLE SELECTION */}
        {step === 2 && (
          <Step2RoleSelect
            data={formData}
            setData={setFormData}
            next={next}
            back={back}
          />
        )}

        {/* 🔹 STUDENT FLOW */}
        {step === 3 && formData.role === "student" && (
          <StudentAcademic
            data={formData}
            setData={setFormData}
            next={next}
            back={back}
          />
        )}

        {step === 4 && formData.role === "student" && (
          <StudentLinks
            data={formData}
            setData={setFormData}
            back={back}
          />
        )}

        {/* 🔹 TRAINER FLOW */}
        {step === 3 && formData.role === "trainer" && (
          <TrainerDetails
            data={formData}
            setData={setFormData}
            back={back}
          />
        )}
      </div>
    </div>
  );
};

export default RegisterWizard;

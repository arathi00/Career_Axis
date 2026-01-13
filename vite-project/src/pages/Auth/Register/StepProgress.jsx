const StepProgress = ({ step, role }) => {
  const steps = role === "student"
    ? ["Account", "Role", "Academic", "Links"]
    : ["Account", "Role", "Details"];

  return (
    <div className="step-progress">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = step === stepNumber;
        const isCompleted = step > stepNumber;

        return (
          <div key={label} className="step-item">
            <div
              className={`step-circle ${
                isActive ? "active" : isCompleted ? "completed" : ""
              }`}
            >
              {stepNumber}
            </div>
            <span className="step-label">{label}</span>

            {index !== steps.length - 1 && (
              <div className="step-line" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepProgress;

import Button from "../../../components/UI/Button";

const InterviewCard = ({ interview, type }) => {
  const interviewTime = new Date(interview.dateTime);
  const now = new Date();

  const canJoin =
    type === "upcoming" &&
    now >= new Date(interviewTime.getTime() - 10 * 60000);

  return (
    <div className="interview-card">
      <h3>{interview.title}</h3>

      <p><strong>Trainer:</strong> {interview.trainerName}</p>
      <p>
        <strong>Date:</strong>{" "}
        {interviewTime.toLocaleDateString()} |{" "}
        {interviewTime.toLocaleTimeString()}
      </p>

      <p><strong>Mode:</strong> Online (Jitsi)</p>

      <span className={`status ${type}`}>
        {type === "upcoming" ? "Scheduled" : "Completed"}
      </span>

      {type === "upcoming" && (
        <Button
          disabled={!canJoin}
          onClick={() => window.open(interview.meetLink)}
        >
          {canJoin ? "Join Interview" : "Not Started"}
        </Button>
      )}

      {type === "past" && (
        <Button variant="secondary">
          View Feedback
        </Button>
      )}
    </div>
  );
};

export default InterviewCard;

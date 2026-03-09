from typing import Dict

def simulate_interview(student_id: int, interview_id: int) -> Dict[str, str]:
	"""Simple placeholder that "simulates" an interview run.

	In a real implementation this would drive an AI model or a telephony/websocket
	session. For now return a dummy transcript and feedback.
	"""
	transcript = (
		f"Interview {interview_id} with student {student_id}:\n"
		"Q: Tell me about yourself.\n"
		"A: (student response)\n"
		"Q: What are your strengths?\n"
		"A: (student response)\n"
	)

	feedback = (
		"Keep answers concise, provide concrete examples, and practice STAR format for behavioral questions."
	)

	return {"transcript": transcript, "feedback": feedback}

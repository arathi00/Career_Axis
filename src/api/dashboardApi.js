// src/api/dashboardApi.js
// Mocked dashboard API for student + trainer dashboards.
// Replace mocked data with axios calls later.

const dashboardApi = {
  // Existing student method (keep if you use it)
  async getStudentDashboard() {
    await new Promise((r) => setTimeout(r, 200));
    return {
      summary: {
        modulesCompleted: 12,
        avgScore: 8.4,
        studyHours: "24h",
        certifications: 3,
      },
      quizHistory: [
        { date: "Jan", score: 70 },
        { date: "Feb", score: 78 },
        { date: "Mar", score: 82 },
      ],
      skillDistribution: [
        { skill: "DSA", value: 80 },
        { skill: "DBMS", value: 70 },
      ],
    };
  },

  // Trainer-focused endpoint: only returns interviews & assigned students for the logged-in trainer
  async getTrainerDashboard() {
    // simulate network delay
    await new Promise((r) => setTimeout(r, 200));

    return {
      stats: {
        interviewsToday: 2,
        pendingInterviews: 3,
        completedInterviews: 5,
        assignedStudentsCount: 8,
      },

      // upcoming interviews assigned to this trainer (only)
      upcomingInterviews: [
        {
          id: "int-101",
          studentId: 11,
          studentName: "Aisha Varma",
          time: "2025-12-13T10:00:00+05:30",
          displayTime: "Dec 13 • 10:00 AM",
          meetingLink: "https://meet.example.com/int-101",
          status: "Pending",
        },
        {
          id: "int-102",
          studentId: 12,
          studentName: "Rohit Nair",
          time: "2025-12-13T14:00:00+05:30",
          displayTime: "Dec 13 • 2:00 PM",
          meetingLink: "https://meet.example.com/int-102",
          status: "Pending",
        },
      ],

      // only students assigned to this trainer for interviews
      assignedStudents: [
        {
          id: 11,
          name: "Aisha Varma",
          email: "aisha.v@example.edu",
          lastInterview: "2025-11-28",
          nextSession: "Dec 13 • 10:00 AM",
          progress: 72,
        },
        {
          id: 12,
          name: "Rohit Nair",
          email: "rohit.n@example.edu",
          lastInterview: "2025-11-29",
          nextSession: "Dec 13 • 2:00 PM",
          progress: 64,
        },
      ],

      // past interviews (for this trainer only)
      pastInterviews: [
        {
          id: "int-88",
          studentId: 9,
          studentName: "Sarah Johnson",
          date: "2025-11-20",
          score: 78,
          feedback: "Strong technical answers; work on clarity.",
        },
        {
          id: "int-90",
          studentId: 10,
          studentName: "David Miller",
          date: "2025-11-25",
          score: 72,
          feedback: "Good communication; needs more algorithm practice.",
        },
      ],
    };
  },
};

export default dashboardApi;

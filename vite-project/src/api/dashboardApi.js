const dashboardApi = {
  getStudentDashboard: async () => {
    await new Promise(r => setTimeout(r, 200));

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
        { date: "Apr", score: 76 },
        { date: "May", score: 88 },
        { date: "Jun", score: 91 },
      ],
      resumeEvolution: [
        { date: "v1", score: 60 },
        { date: "v2", score: 68 },
        { date: "v3", score: 74 },
        { date: "v4", score: 81 },
      ],
      skillDistribution: [
        { skill: "DSA", value: 80 },
        { skill: "DBMS", value: 70 },
        { skill: "OS", value: 65 },
        { skill: "Networks", value: 55 },
        { skill: "Aptitude", value: 75 },
      ],
    };
  },
};

export default dashboardApi;

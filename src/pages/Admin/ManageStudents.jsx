import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const limit = 10;

  // ✅ Fetch Students (Backend Pagination)
  const fetchStudents = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("access_token");
      console.log("Token:", token);

      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const res = await axios.get(
        `/admin/students?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudents(res.data.data);
      setTotal(res.data.total);

    } catch (error) {
      console.error("Error fetching students:", error);

      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Please check your token or log in again.");
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page]);

  // ✅ Disable Student
  const disableStudent = async (id) => {
    try {
      const token = localStorage.getItem("access_token");

      await axios.put(
        `/admin/students/${id}/disable`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchStudents();

    } catch (error) {
      console.error("Disable failed:", error);
    }
  };

  // ✅ Delete Student
  const deleteStudent = async (id) => {
    try {
      const token = localStorage.getItem("access_token");

      await axios.delete(
        `/admin/students/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchStudents();

    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // ✅ View Student Details (Modal)
  const openModal = async (id) => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await axios.get(
        `/admin/students/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedStudent(res.data);

    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const closeModal = () => {
    setSelectedStudent(null);
  };

  // ✅ Filtering (Frontend)
  const filtered = students
    .filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((s) =>
      filter === "all" ? true : s.status === filter
    );

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="manage-container">

      <div className="header">
        <h2 className="manage-trainers-title">Manage Students</h2>

        <div className="controls">

          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
          </select>

          <span className="total">
            Total Students: {total}
          </span>

        </div>
      </div>

      <div className="table-wrapper">

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="student-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>CGPA</th>
                <th>Resume</th>
                <th>Quiz Avg</th>
                <th>Interviews</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">
                    No students found
                  </td>
                </tr>
              ) : (
                filtered.map((student) => (
                  <tr key={student.id}>

                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.cgpa}</td>
                    <td>{student.resume_score}</td>
                    <td>{student.quiz_avg}</td>
                    <td>{student.interviews}</td>

                    <td>
                      <span
                        className={
                          student.status === "Active"
                            ? "badge active"
                            : "badge disabled"
                        }
                      >
                        {student.status}
                      </span>
                    </td>

                    <td className="actions">

                      <button
                        className="view"
                        onClick={() => openModal(student.id)}
                      >
                        View
                      </button>

                      <button
                        className="disable"
                        onClick={() => disableStudent(student.id)}
                      >
                        Disable
                      </button>

                      <button
                        className="delete"
                        onClick={() => deleteStudent(student.id)}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>
        )}

      </div>

      {/* ✅ Pagination */}

      <div className="pagination">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>

      </div>

      {/* ✅ Modal */}

      {selectedStudent && (
        <div className="modal-overlay">

          <div className="modal">

            <h3>Student Details</h3>

            <p><strong>Name:</strong> {selectedStudent.name}</p>
            <p><strong>Email:</strong> {selectedStudent.email}</p>
            <p><strong>CGPA:</strong> {selectedStudent.cgpa}</p>
            <p><strong>Resume Score:</strong> {selectedStudent.resume_score}</p>
            <p><strong>Quiz Scores:</strong> {selectedStudent.quiz_scores?.join(", ")}</p>
            <p><strong>Interviews:</strong> {selectedStudent.interviews}</p>

            <button onClick={closeModal}>
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default ManageStudents;
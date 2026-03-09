import React, { useEffect, useState } from "react"
import "../../styles/AdminDashboard.css"
import {
  getPendingTrainers,
  getApprovedTrainers,
  approveTrainer,
  rejectTrainer,
  disableTrainer
} from "../../api/adminApi"

const ManageTrainers = () => {

  const [tab, setTab] = useState("pending")
  const [pendingTrainers, setPendingTrainers] = useState([])
  const [approvedTrainers, setApprovedTrainers] = useState([])

  const [selectedTrainer, setSelectedTrainer] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchTrainers()
  }, [])

  const fetchTrainers = async () => {
    try {

      const pending = await getPendingTrainers()
      const approved = await getApprovedTrainers()

      setPendingTrainers(pending.data || [])
      setApprovedTrainers(approved.data || [])

    } catch (err) {
      console.error("Error fetching trainers", err)
    }
  }

  const handleApprove = async (id) => {
    await approveTrainer(id)
    fetchTrainers()
  }

  const handleReject = async (id) => {
    await rejectTrainer(id)
    fetchTrainers()
  }

  const handleDisable = async (id) => {
    await disableTrainer(id)
    fetchTrainers()
  }

  const handleView = (trainer) => {
    setSelectedTrainer(trainer)
    setShowModal(true)
  }

  const trainers = tab === "pending" ? pendingTrainers : approvedTrainers

  return (
    <div className="manage-trainers-container">

      <h2 className="manage-trainers-title">Manage Trainers</h2>

      <div className="trainer-tabs">

        <button
          className={tab === "pending" ? "active-tab" : ""}
          onClick={() => setTab("pending")}
        >
          Pending Approval
        </button>

        <button
          className={tab === "approved" ? "active-tab" : ""}
          onClick={() => setTab("approved")}
        >
          Approved Trainers
        </button>

      </div>

      <table className="trainers-table">

        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Expertise</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {trainers.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No trainers found
              </td>
            </tr>
          )}

          {trainers.map((trainer) => (
            <tr key={trainer.id}>

              <td>{trainer.name}</td>
              <td>{trainer.email}</td>

              <td>
                {trainer.trainer_details?.expertise || "N/A"}
              </td>

              <td>
                <span className={trainer.is_approved ? "status-approved" : "status-pending"}>
                  {trainer.is_approved ? "Approved" : "Pending"}
                </span>
              </td>

              <td>

                <button
                  className="action-btn btn-view"
                  onClick={() => handleView(trainer)}
                >
                  View
                </button>

                {tab === "pending" && (
                  <>
                    <button
                      className="action-btn btn-approve"
                      onClick={() => handleApprove(trainer.id)}
                    >
                      Approve
                    </button>

                    <button
                      className="action-btn btn-reject"
                      onClick={() => handleReject(trainer.id)}
                    >
                      Reject
                    </button>
                  </>
                )}

                {tab === "approved" && (
                  <button
                    className="action-btn btn-disable"
                    onClick={() => handleDisable(trainer.id)}
                  >
                    Disable
                  </button>
                )}

              </td>

            </tr>
          ))}

        </tbody>

      </table>

      {showModal && selectedTrainer && (
        <div className="modal-overlay">

          <div className="modal-box">

            <h3>Trainer Profile</h3>

            <p><b>Name:</b> {selectedTrainer.name}</p>
            <p><b>Email:</b> {selectedTrainer.email}</p>

            <p>
              <b>Expertise:</b>{" "}
              {selectedTrainer.trainer_details?.expertise || "N/A"}
            </p>

            <p>
              <b>Status:</b>{" "}
              {selectedTrainer.is_approved ? "Approved" : "Pending"}
            </p>

            <button
              className="modal-close"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  )
}

export default ManageTrainers
import { useState, useEffect } from "react";
import {
  getUserSessions,
  getTrainingFocuses,
} from "../../services/userSessions";
import { useNavigate } from "react-router-dom";
import { deleteTrainingSession } from "../../services/userSessions";
import "./Session.css";

export const SessionList = () => {
  const [sessions, setSessions] = useState([]);
  const [focuses, setFocuses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUserSessions().then((trainingSessionObj) =>
      setSessions(trainingSessionObj)
    );
    getTrainingFocuses().then(setFocuses);
  }, []);

  const user = JSON.parse(localStorage.getItem("HEMA_user"));
  const userId = user.id;
  const userSessions = sessions.filter((session) => session.userId === userId);

  const handleDelete = async (id) => {
    await deleteTrainingSession(id);
    setSessions(sessions.filter((session) => session.id !== id));
  };

  const getFocusAreaNames = (focusAreaIds) => {
    return focusAreaIds
      .map((id) => focuses.find((f) => f.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="container-session">
      <h1>Session List</h1>
      <button
        className="new-session-btn"
        onClick={() => navigate("/sessions/new")}
      >
        + New Training Session
      </button>
      <ul className="session-list">
        {userSessions.map((session) => (
          <div key={session.id} className="session-card">
            <h2>{session.title}</h2>
            <p>Date: {session.date}</p>
            <p>Duration: {session.duration} minutes</p>
            <p>Intensity: {session.intensity}</p>
            <p>Notes: {session.notes}</p>
            <p>Focus Areas: {getFocusAreaNames(session.focusAreas || [])}</p>
            <button
              className="edit-btn"
              onClick={() => navigate(`/sessions/edit/${session.id}`)}
            >
              Edit
            </button>
            <button
              className="delete-btn"
              onClick={() => handleDelete(session.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
};

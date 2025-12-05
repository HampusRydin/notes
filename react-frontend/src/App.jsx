import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./index.css";
import AuthForm from "./components/AuthForm";
import NotesSection from "./components/NotesSection";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";

const API_BASE = "http://localhost:3000/api";

function RequireAuth({ token, children }) {
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const { token, loggedIn, authMessage, register, login, logout } = useAuth();

  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);

  const navigate = useNavigate();

  // Fetch notes when token becomes available
  useEffect(() => {
    if (token) {
      fetchNotes();
    } else {
      setNotes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // -------- Auth handlers (use context) --------
  async function handleRegister(formData) {
    await register(formData);
  }

  async function handleLogin(formData) {
    const success = await login(formData);
    if (success) {
      navigate("/notes");
    }
  }

  function handleLogout() {
    logout();
    setNotes([]);
    navigate("/login");
  }

  // -------- Notes logic (still in App) --------
  async function fetchNotes() {
    if (!token) return;

    setLoadingNotes(true);

    try {
      const res = await fetch(`${API_BASE}/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Error fetching notes", err);
    } finally {
      setLoadingNotes(false);
    }
  }

  async function handleAddNote(text) {
    if (!token) {
      alert("You must be logged in to add notes");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      await fetchNotes();
    } catch (err) {
      console.error("Error adding note", err);
    }
  }

  async function handleDeleteNote(id) {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      await fetchNotes();
    } catch (err) {
      console.error("Error deleting note", err);
    }
  }

  return (
    <div className="app">
      <Navbar loggedIn={loggedIn} onLogout={handleLogout} />

      <main className="main">
        <Routes>
          {/* Login page */}
          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate to="/notes" replace />
              ) : (
                <AuthForm
                  onRegister={handleRegister}
                  onLogin={handleLogin}
                  message={authMessage}
                />
              )
            }
          />

          {/* Notes page (protected) */}
          <Route
            path="/notes"
            element={
              <RequireAuth token={token}>
                <NotesSection
                  notes={notes}
                  loading={loadingNotes}
                  onAddNote={handleAddNote}
                  onDeleteNote={handleDeleteNote}
                  onLogout={handleLogout}
                />
              </RequireAuth>
            }
          />

          {/* Default / fallback route */}
          <Route
            path="*"
            element={
              <Navigate to={loggedIn ? "/notes" : "/login"} replace />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;

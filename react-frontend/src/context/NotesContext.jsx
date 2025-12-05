import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const NotesContext = createContext();

const API_BASE = "http://localhost:3000/api";

export function NotesProvider({ children }) {
  const { token, logout } = useAuth();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch notes when token changes (login/logout)
  useEffect(() => {
    if (token) {
      fetchNotes();
    } else {
      setNotes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function fetchNotes() {
    if (!token) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        logout();
        return;
      }

      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Error fetching notes", err);
    } finally {
      setLoading(false);
    }
  }

  async function addNote(text) {
    if (!token) return;

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
        logout();
        return;
      }

      await fetchNotes();
    } catch (err) {
      console.error("Error adding note", err);
    }
  }

  async function deleteNote(id) {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        logout();
        return;
      }

      await fetchNotes();
    } catch (err) {
      console.error("Error deleting note", err);
    }
  }

  return (
    <NotesContext.Provider
      value={{ notes, loading, addNote, deleteNote }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  return useContext(NotesContext);
}

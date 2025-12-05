import { useState } from "react";
import { useNotes } from "../context/NotesContext";
import { useAuth } from "../context/AuthContext";

function NotesSection() {
  const [noteText, setNoteText] = useState("");

  const { notes, loading, addNote, deleteNote } = useNotes();
  const { logout } = useAuth();

  async function handleAddClick() {
    const text = noteText.trim();
    if (!text) {
      alert("Note cannot be empty!");
      return;
    }

    await addNote(text);
    setNoteText("");
  }

  return (
    <div className="card">
      <div className="header-row">
        <h2>Your Notes</h2>
        <button className="secondary" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="note-input">
        <textarea
          placeholder="Write your note here..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
        <button onClick={handleAddClick}>Add Note</button>
      </div>

      {loading ? (
        <p>Loading notes...</p>
      ) : notes.length === 0 ? (
        <p>No notes yet. Add your first one!</p>
      ) : (
        <div className="notes-container">
          {notes.map((note) => (
            <div key={note._id} className="note">
              <span>{note.text}</span>
              <button
                className="danger"
                onClick={() => deleteNote(note._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotesSection;

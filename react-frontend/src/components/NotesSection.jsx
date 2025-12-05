import { useState } from "react";
import { useNotes } from "../context/NotesContext";
import { useAuth } from "../context/AuthContext";

function NotesSection() {
  const [noteText, setNoteText] = useState("");      // new note
  const [editingId, setEditingId] = useState(null);  // which note is being edited
  const [editingText, setEditingText] = useState(""); // text while editing

  const { notes, loading, addNote, deleteNote, updateNote } = useNotes();
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

  function startEditing(note) {
    setEditingId(note._id);
    setEditingText(note.text);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingText("");
  }

  async function saveEditing() {
    const text = editingText.trim();
    if (!text) {
      alert("Note cannot be empty!");
      return;
    }

    await updateNote(editingId, text);
    setEditingId(null);
    setEditingText("");
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
              {editingId === note._id ? (
                <>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={saveEditing}>Save</button>
                    <button className="secondary" onClick={cancelEditing}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span>{note.text}</span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => startEditing(note)}>Edit</button>
                    <button
                      className="danger"
                      onClick={() => deleteNote(note._id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotesSection;

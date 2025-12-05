import { useState } from "react";

function NotesSection({ notes, loading, onAddNote, onDeleteNote, onLogout }) {
  const [noteText, setNoteText] = useState("");

  async function handleAddClick() {
    const text = noteText.trim();
    if (!text) {
      alert("Note cannot be empty!");
      return;
    }

    await onAddNote(text);
    setNoteText("");
  }

  return (
    <div className="card">
      <div className="header-row">
        <h2>Your Notes</h2>
        <button className="secondary" onClick={onLogout}>
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
                onClick={() => onDeleteNote(note._id)}
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

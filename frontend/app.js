const API_BASE = 'http://localhost:3000/api';

const addBtn = document.getElementById('addBtn');
const noteText = document.getElementById('noteText');
const notesContainer = document.getElementById('notesContainer');

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');
const authMessage = document.getElementById('authMessage');

const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');
const logoutBtn = document.getElementById('logoutBtn');

let authToken = localStorage.getItem('token') || null;

function updateUIForAuth() {
  if (authToken) {
    authSection.style.display = 'none';
    appSection.style.display = 'block';
    fetchNotes();
  } else {
    authSection.style.display = 'block';
    appSection.style.display = 'none';
  }
}

// -------- Auth functions --------

async function register() {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  authMessage.textContent = '';

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      authMessage.textContent = data.error || 'Registration failed';
      return;
    }

    authMessage.textContent = 'Registered successfully! You can now log in.';
  } catch (err) {
    authMessage.textContent = 'Network error during registration';
  }
}

async function login() {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  authMessage.textContent = '';

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      authMessage.textContent = data.error || 'Login failed';
      return;
    }

    authToken = data.token;
    localStorage.setItem('token', authToken);

    emailInput.value = '';
    passwordInput.value = '';
    authMessage.textContent = '';

    updateUIForAuth();
  } catch (err) {
    authMessage.textContent = 'Network error during login';
  }
}

function logout() {
  authToken = null;
  localStorage.removeItem('token');
  notesContainer.innerHTML = '';
  updateUIForAuth();
}

// -------- Notes API functions --------

async function fetchNotes() {
  if (!authToken) return;

  try {
    const res = await fetch(`${API_BASE}/notes`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (res.status === 401) {
      logout();
      return;
    }

    const notes = await res.json();
    renderNotes(notes);
  } catch (err) {
    console.error('Error fetching notes', err);
  }
}

function renderNotes(notes) {
  notesContainer.innerHTML = '';

  notes.forEach(note => {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note';

    const textSpan = document.createElement('span');
    textSpan.textContent = note.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.marginLeft = '10px';

    deleteBtn.addEventListener('click', () => deleteNote(note._id));

    noteDiv.appendChild(textSpan);
    noteDiv.appendChild(deleteBtn);
    notesContainer.appendChild(noteDiv);
  });
}

async function addNote() {
  if (!authToken) {
    alert('You must be logged in to add notes');
    return;
  }

  const text = noteText.value.trim();
  if (!text) return alert('Note cannot be empty!');

  try {
    const res = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ text }),
    });

    if (res.status === 401) {
      logout();
      return;
    }

    noteText.value = '';
    await fetchNotes();
  } catch (err) {
    console.error('Error adding note', err);
  }
}

async function deleteNote(id) {
  if (!authToken) return;

  try {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (res.status === 401) {
      logout();
      return;
    }

    await fetchNotes();
  } catch (err) {
    console.error('Error deleting note', err);
  }
}

// -------- Event listeners --------

addBtn.addEventListener('click', addNote);
registerBtn.addEventListener('click', register);
loginBtn.addEventListener('click', login);
logoutBtn.addEventListener('click', logout);

// Initialize UI on page load
updateUIForAuth();

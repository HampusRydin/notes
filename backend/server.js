const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// In a real app, store this in an environment variable
const JWT_SECRET = 'supersecretkey';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect('mongodb://root:example@localhost:27017/notes?authSource=admin')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User model
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// Note model (now linked to a user)
const NoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Note = mongoose.model('Note', NoteSchema);

// Auth middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization']; // e.g. "Bearer <token>"
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Invalid Authorization format' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { userId, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ---------- Auth routes ----------

// Register
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !email.trim() || !password || password.length < 6) {
    return res
      .status(400)
      .json({ error: 'Email and password (min 6 chars) are required' });
  }

  const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already in use' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    email: email.trim().toLowerCase(),
    passwordHash,
  });

  res.status(201).json({ message: 'User registered successfully' });
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

// ---------- Notes routes (protected) ----------

// Get notes for logged-in user
app.get('/api/notes', authMiddleware, async (req, res) => {
  const notes = await Note.find({ userId: req.user.userId });
  res.json(notes);
});

// Create a new note for logged-in user
app.post('/api/notes', authMiddleware, async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const newNote = await Note.create({
    text: text.trim(),
    userId: req.user.userId,
  });

  res.status(201).json(newNote);
});

// Delete a note (only if it belongs to the logged-in user)
app.delete('/api/notes/:id', authMiddleware, async (req, res) => {
  await Note.deleteOne({ _id: req.params.id, userId: req.user.userId });
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

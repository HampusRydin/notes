const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// === CONFIG ===
const PORT = 3000;
const JWT_SECRET = 'supersecretkey'; // For learning; use env vars in real apps

// === CONNECT TO MONGO ===
// When running tests, Jest runs this file without starting the server.
// Mongo will still connect normally as long as your Docker container is running.
mongoose
  .connect('mongodb://root:example@localhost:27017/notes?authSource=admin')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// === MODELS ===
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});

const NoteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);
const Note = mongoose.model('Note', NoteSchema);

// === AUTH MIDDLEWARE ===
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'Missing or invalid token' });

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// === AUTH ROUTES ===
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim())
    return res.status(400).json({ error: 'Email and password required' });

  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({ email, passwordHash });
  return res.status(201).json({ message: 'User created' });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
  return res.json({ token });
});

// === NOTES ROUTES ===
app.get('/api/notes', authMiddleware, async (req, res) => {
  const notes = await Note.find({ userId: req.user.userId }).sort({ createdAt: -1 });
  res.json(notes);
});

app.post('/api/notes', authMiddleware, async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim())
    return res.status(400).json({ error: 'Text is required' });

  const note = await Note.create({
    text: text.trim(),
    userId: req.user.userId
  });

  res.status(201).json(note);
});

app.put('/api/notes/:id', authMiddleware, async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim())
    return res.status(400).json({ error: 'Text is required' });

  const updated = await Note.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    { text: text.trim() },
    { new: true }
  );

  if (!updated) return res.status(404).json({ error: 'Note not found' });
  res.json(updated);
});

app.delete('/api/notes/:id', authMiddleware, async (req, res) => {
  await Note.deleteOne({ _id: req.params.id, userId: req.user.userId });
  res.status(204).send();
});

// === START SERVER (only when not in tests) ===
// Jest requires that the server NOT start automatically
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Jest tests
module.exports = app;

const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');

describe('Notes API', () => {
  it('rejects unauthorized access to /api/notes', async () => {
    const res = await request(app).get('/api/notes');

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});

describe('Auth + Notes flow', () => {
  it('allows a user to register, login, and manage notes', async () => {
    const email = `test${Date.now()}@example.com`;
    const password = 'password123';

    // Register
    const registerRes = await request(app)
      .post('/api/register')
      .send({ email, password });
    expect(registerRes.statusCode).toBe(201);

    // Login
    const loginRes = await request(app)
      .post('/api/login')
      .send({ email, password });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('token');

    const token = loginRes.body.token;

    // Get notes (should be empty)
    const getRes = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.statusCode).toBe(200);
    expect(Array.isArray(getRes.body)).toBe(true);

    // Add a note
    const noteText = 'Test note from Jest';
    const addRes = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ text: noteText });
    expect(addRes.statusCode).toBe(201);
    expect(addRes.body).toHaveProperty('_id');
    expect(addRes.body.text).toBe(noteText);

    // Get notes again and check that it contains the new note
    const getRes2 = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${token}`);
    expect(getRes2.statusCode).toBe(200);
    const notes = getRes2.body;
    const found = notes.find((n) => n.text === noteText);
    expect(found).toBeTruthy();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

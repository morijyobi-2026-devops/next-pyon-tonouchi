const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(bodyParser.json());

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Register user (email + password)
app.post('/api/users/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email/password required' });
  try {
    const user = await db.createUser(email, password);
    res.json({ id: user.id, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Simple login (returns user id)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email/password required' });
  try {
    const user = await db.verifyUser(email, password);
    if (!user) return res.status(401).json({ error: 'invalid credentials' });
    res.json({ id: user.id, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: create course
app.post('/api/courses', async (req, res) => {
  const { name, weekday, period, room } = req.body;
  if (!name || weekday == null || period == null || !room) return res.status(400).json({ error: 'missing fields' });
  try {
    const course = await db.createCourse(name, weekday, period, room);
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await db.listCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enroll in course
app.post('/api/enroll', async (req, res) => {
  const { userId, courseId } = req.body;
  if (!userId || !courseId) return res.status(400).json({ error: 'userId and courseId required' });
  try {
    await db.enroll(userId, courseId);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's timetable (weekday x period mapping)
app.get('/api/users/:id/timetable', async (req, res) => {
  try {
    const timetable = await db.getUserTimetable(req.params.id);
    res.json(timetable);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

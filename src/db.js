const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'data', 'app.db');

const db = new sqlite3.Database(dbPath);

function run(sql, params=[]) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) return reject(err);
      resolve({ id: this.lastID });
    });
  });
}

function all(sql, params=[]) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
  });
}

function get(sql, params=[]) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
  });
}

async function migrate() {
  await run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password TEXT)`);
  await run(`CREATE TABLE IF NOT EXISTS courses (id INTEGER PRIMARY KEY, name TEXT, weekday INTEGER, period INTEGER, room TEXT)`);
  await run(`CREATE TABLE IF NOT EXISTS enrollments (id INTEGER PRIMARY KEY, user_id INTEGER, course_id INTEGER, UNIQUE(user_id, course_id))`);
}

async function createUser(email, password) {
  const hash = await bcrypt.hash(password, 8);
  const res = await run(`INSERT INTO users (email, password) VALUES (?,?)`, [email, hash]);
  return { id: res.id, email };
}

async function verifyUser(email, password) {
  const user = await get(`SELECT * FROM users WHERE email = ?`, [email]);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  return ok ? { id: user.id, email: user.email } : null;
}

async function createCourse(name, weekday, period, room) {
  const res = await run(`INSERT INTO courses (name, weekday, period, room) VALUES (?,?,?,?)`, [name, weekday, period, room]);
  return { id: res.id, name, weekday, period, room };
}

async function listCourses() {
  return await all(`SELECT * FROM courses ORDER BY weekday, period`);
}

async function enroll(userId, courseId) {
  await run(`INSERT OR IGNORE INTO enrollments (user_id, course_id) VALUES (?,?)`, [userId, courseId]);
}

async function getUserTimetable(userId) {
  const rows = await all(`SELECT c.* FROM courses c JOIN enrollments e ON e.course_id = c.id WHERE e.user_id = ? ORDER BY c.weekday, c.period`, [userId]);
  return rows;
}

module.exports = {
  migrate,
  createUser,
  verifyUser,
  createCourse,
  listCourses,
  enroll,
  getUserTimetable
};

// One-time script to create the mentor account (single-mentor academy, no public signup).
// Usage: node db/create-mentor.js "الاسم" "email@example.com" "password123" "نبذة تعريفية"
const bcrypt = require('bcryptjs');
const pool = require('./pool');

async function main() {
  const [name, email, password, bio] = process.argv.slice(2);
  if (!name || !email || !password) {
    console.log('Usage: node db/create-mentor.js "الاسم" "email" "password" "بيو اختياري"');
    process.exit(1);
  }
  const password_hash = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    `INSERT INTO mentors (name, email, password_hash, bio) VALUES ($1,$2,$3,$4)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, bio = EXCLUDED.bio
     RETURNING id, name, email`,
    [name, email, password_hash, bio || '']
  );
  console.log('✅ Mentor account ready:', rows[0]);
  pool.end();
}

main();

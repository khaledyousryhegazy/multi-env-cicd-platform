const pool = require('../db/pool');

// GET /api/surahs - list of all 114 surahs (reference data)
async function getSurahs(req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM surahs ORDER BY number ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
}

// GET /api/students/by-email/:email - find or return student profile
async function getStudentByEmail(req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM students WHERE email = $1', [req.params.email]);
    if (!rows[0]) return res.status(404).json({ error: 'لم يتم العثور على طالب بهذا البريد' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
}

// POST /api/students - register a new student
async function createStudent(req, res) {
  const { name, email, phone } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'الاسم والبريد الإلكتروني مطلوبان' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO students (name, email, phone) VALUES ($1,$2,$3)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone
       RETURNING *`,
      [name, email, phone || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
}

// GET /api/students/:id/progress - full progress across all 114 surahs
async function getStudentProgress(req, res) {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT s.id AS surah_id, s.number, s.name_arabic, s.name_english, s.total_ayahs,
              COALESCE(sp.status, 'not_started') AS status,
              COALESCE(sp.ayahs_memorized, 0) AS ayahs_memorized
       FROM surahs s
       LEFT JOIN student_progress sp ON sp.surah_id = s.id AND sp.student_id = $1
       ORDER BY s.number ASC`,
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
}

// POST /api/students/:id/progress - upsert progress for one surah
async function updateStudentProgress(req, res) {
  const { id } = req.params;
  const { surah_id, status, ayahs_memorized } = req.body;
  if (!surah_id || !status) return res.status(400).json({ error: 'surah_id و status مطلوبان' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO student_progress (student_id, surah_id, status, ayahs_memorized, updated_at)
       VALUES ($1,$2,$3,$4,NOW())
       ON CONFLICT (student_id, surah_id)
       DO UPDATE SET status = EXCLUDED.status, ayahs_memorized = EXCLUDED.ayahs_memorized, updated_at = NOW()
       RETURNING *`,
      [id, surah_id, status, ayahs_memorized || 0]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
}

module.exports = {
  getSurahs,
  getStudentByEmail,
  createStudent,
  getStudentProgress,
  updateStudentProgress,
};

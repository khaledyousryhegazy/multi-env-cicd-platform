const pool = require('../db/pool');

// GET /api/mentor - public info for the About page (single-mentor academy)
async function getMentorProfile(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, bio FROM mentors ORDER BY id ASC LIMIT 1'
    );
    if (!rows[0]) return res.status(404).json({ error: 'لا يوجد مرشد مسجل بعد' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
}

module.exports = { getMentorProfile };

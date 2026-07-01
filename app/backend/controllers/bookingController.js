const pool = require('../db/pool');

// GET /api/availability - mentor's weekly availability (public)
async function getAvailability(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM availability ORDER BY day_of_week ASC, start_time ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
}

// POST /api/availability - mentor sets a weekly slot (protected)
async function addAvailability(req, res) {
  const { day_of_week, start_time, end_time } = req.body;
  if (day_of_week === undefined || !start_time || !end_time) {
    return res.status(400).json({ error: 'اليوم ووقت البداية والنهاية مطلوبة' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO availability (mentor_id, day_of_week, start_time, end_time)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [req.mentor.id, day_of_week, start_time, end_time]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
}

// POST /api/bookings - a student books a session (public)
async function createBooking(req, res) {
  const { student_id, mentor_id, booking_date, start_time, end_time, notes } = req.body;
  if (!student_id || !mentor_id || !booking_date || !start_time || !end_time) {
    return res.status(400).json({ error: 'جميع بيانات الحجز مطلوبة' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO bookings (student_id, mentor_id, booking_date, start_time, end_time, notes)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [student_id, mentor_id, booking_date, start_time, end_time, notes || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
}

// GET /api/bookings - mentor views all bookings (protected)
async function getBookings(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT b.*, st.name AS student_name, st.email AS student_email
       FROM bookings b
       JOIN students st ON st.id = b.student_id
       WHERE b.mentor_id = $1
       ORDER BY b.booking_date ASC, b.start_time ASC`,
      [req.mentor.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
}

// PATCH /api/bookings/:id - mentor updates booking status (protected)
async function updateBookingStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'cancelled', 'completed'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'حالة غير صالحة' });
  }
  try {
    const { rows } = await pool.query(
      `UPDATE bookings SET status = $1 WHERE id = $2 AND mentor_id = $3 RETURNING *`,
      [status, id, req.mentor.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'الحجز غير موجود' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
}

module.exports = {
  getAvailability,
  addAvailability,
  createBooking,
  getBookings,
  updateBookingStatus,
};

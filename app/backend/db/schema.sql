-- Nur Al-Quran Academy - PostgreSQL Schema

CREATE TABLE IF NOT EXISTS mentors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(30),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS surahs (
  id SERIAL PRIMARY KEY,
  number INT UNIQUE NOT NULL,
  name_arabic VARCHAR(50) NOT NULL,
  name_english VARCHAR(50) NOT NULL,
  total_ayahs INT NOT NULL
);

CREATE TABLE IF NOT EXISTS student_progress (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  surah_id INT NOT NULL REFERENCES surahs(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'not_started', -- not_started | in_progress | memorized
  ayahs_memorized INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, surah_id)
);

CREATE TABLE IF NOT EXISTS availability (
  id SERIAL PRIMARY KEY,
  mentor_id INT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL, -- 0=Sunday ... 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  mentor_id INT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending | confirmed | cancelled | completed
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_progress_student ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_mentor_date ON bookings(mentor_id, booking_date);

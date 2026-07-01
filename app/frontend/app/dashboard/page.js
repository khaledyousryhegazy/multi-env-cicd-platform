'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

const STATUS_LABELS = {
  pending: 'قيد الانتظار',
  confirmed: 'مؤكد',
  cancelled: 'ملغي',
  completed: 'مكتمل',
};

const PROGRESS_LABELS = {
  not_started: 'لم يبدأ',
  in_progress: 'قيد الحفظ',
  memorized: 'محفوظة',
};

export default function DashboardPage() {
  const [token, setToken] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState('bookings');

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? sessionStorage.getItem('mentor_token') : null;
    if (saved) setToken(saved);
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    try {
      const { token } = await api.login(loginForm);
      sessionStorage.setItem('mentor_token', token);
      setToken(token);
    } catch (err) {
      setLoginError(err.message);
    }
  }

  function logout() {
    sessionStorage.removeItem('mentor_token');
    setToken(null);
  }

  if (!token) {
    return (
      <main className="section">
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--emerald-900)' }}>
            تسجيل دخول المرشد
          </h1>
          <form onSubmit={handleLogin} className="card" style={{ maxWidth: 420, marginTop: 20 }}>
            <div className="field">
              <label>البريد الإلكتروني</label>
              <input required type="email" value={loginForm.email}
                onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="field">
              <label>كلمة المرور</label>
              <input required type="password" value={loginForm.password}
                onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))} />
            </div>
            {loginError && <p style={{ color: 'crimson' }}>{loginError}</p>}
            <button className="btn btn-gold" type="submit">دخول</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--emerald-900)' }}>
            لوحة تحكم المرشد
          </h1>
          <button className="btn" onClick={logout}>تسجيل الخروج</button>
        </div>

        <div style={{ display: 'flex', gap: 12, margin: '20px 0' }}>
          <button className="btn" style={{ background: tab === 'bookings' ? 'var(--emerald-800)' : 'var(--emerald-600)' }} onClick={() => setTab('bookings')}>
            الحجوزات
          </button>
          <button className="btn" style={{ background: tab === 'progress' ? 'var(--emerald-800)' : 'var(--emerald-600)' }} onClick={() => setTab('progress')}>
            تقدم الطلاب
          </button>
        </div>

        {tab === 'bookings' ? <BookingsPanel token={token} /> : <ProgressPanel token={token} />}
      </div>
    </main>
  );
}

function BookingsPanel({ token }) {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  async function load() {
    try {
      setBookings(await api.getBookings(token));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function changeStatus(id, status) {
    try {
      await api.updateBookingStatus(token, id, status);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {bookings.length === 0 && <p>لا توجد حجوزات حالياً.</p>}
      <div className="grid" style={{ gap: 12 }}>
        {bookings.map((b) => (
          <div key={b.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <strong>{b.student_name}</strong> — {b.student_email}
              <p style={{ margin: '4px 0', color: '#7a7566', fontSize: 14 }}>
                {new Date(b.booking_date).toLocaleDateString('ar-EG')} | {b.start_time.slice(0,5)} - {b.end_time.slice(0,5)}
              </p>
              {b.notes && <p style={{ fontSize: 13 }}>ملاحظات: {b.notes}</p>}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className={`badge badge-${b.status === 'confirmed' || b.status === 'completed' ? 'memorized' : b.status === 'pending' ? 'in_progress' : 'not_started'}`}>
                {STATUS_LABELS[b.status]}
              </span>
              <select value={b.status} onChange={(e) => changeStatus(b.id, e.target.value)} style={{ width: 'auto' }}>
                {Object.keys(STATUS_LABELS).map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressPanel() {
  const [email, setEmail] = useState('');
  const [student, setStudent] = useState(null);
  const [progress, setProgress] = useState([]);
  const [error, setError] = useState('');

  async function search(e) {
    e.preventDefault();
    setError('');
    try {
      const st = await api.getStudentByEmail(email);
      setStudent(st);
      setProgress(await api.getStudentProgress(st.id));
    } catch (err) {
      setError(err.message);
      setStudent(null);
    }
  }

  async function updateSurah(surah_id, status, ayahs_memorized) {
    try {
      await api.updateStudentProgress(student.id, { surah_id, status, ayahs_memorized });
      setProgress(await api.getStudentProgress(student.id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <form onSubmit={search} className="card" style={{ maxWidth: 480, display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <div className="field" style={{ flex: 1, marginBottom: 0 }}>
          <label>بريد الطالب</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button className="btn" type="submit">بحث</button>
      </form>

      {error && <p style={{ color: 'crimson', marginTop: 14 }}>{error}</p>}

      {student && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ color: 'var(--emerald-800)' }}>{student.name}</h3>
          <div className="grid grid-3" style={{ marginTop: 12 }}>
            {progress.map((p) => (
              <div key={p.surah_id} className="card" style={{ padding: 12 }}>
                <strong>{p.number}. {p.name_arabic}</strong>
                <div style={{ marginTop: 8 }}>
                  <select
                    value={p.status}
                    onChange={(e) => updateSurah(p.surah_id, e.target.value, p.ayahs_memorized)}
                  >
                    {Object.keys(PROGRESS_LABELS).map((s) => (
                      <option key={s} value={s}>{PROGRESS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

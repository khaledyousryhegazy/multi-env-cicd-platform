'use client';
import { useState } from 'react';
import { api } from '../../lib/api';

const STATUS_LABELS = {
  not_started: 'لم يبدأ',
  in_progress: 'قيد الحفظ',
  memorized: 'محفوظة',
};

export default function ProgressPage() {
  const [email, setEmail] = useState('');
  const [student, setStudent] = useState(null);
  const [progress, setProgress] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const st = await api.getStudentByEmail(email);
      setStudent(st);
      const prog = await api.getStudentProgress(st.id);
      setProgress(prog);
    } catch (err) {
      setError(err.message);
      setStudent(null);
      setProgress([]);
    } finally {
      setLoading(false);
    }
  }

  const memorizedCount = progress.filter((p) => p.status === 'memorized').length;

  return (
    <main className="section">
      <div className="container">
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--emerald-900)' }}>
          تقدم الحفظ
        </h1>

        <form onSubmit={handleSearch} className="card" style={{ maxWidth: 480, marginTop: 20, display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div className="field" style={{ flex: 1, marginBottom: 0 }}>
            <label>ابحث ببريدك الإلكتروني</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'جارِ البحث...' : 'عرض التقدم'}
          </button>
        </form>

        {error && <p style={{ color: 'crimson', marginTop: 16 }}>{error}</p>}

        {student && (
          <div style={{ marginTop: 30 }}>
            <h2 style={{ color: 'var(--emerald-800)' }}>
              مرحباً {student.name} — حفظت {memorizedCount} من 114 سورة
            </h2>
            <div className="grid grid-3" style={{ marginTop: 16 }}>
              {progress.map((p) => (
                <div key={p.surah_id} className="card" style={{ padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{p.number}. {p.name_arabic}</strong>
                    <span className={`badge badge-${p.status}`}>{STATUS_LABELS[p.status]}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#7a7566', margin: '6px 0 0' }}>
                    {p.ayahs_memorized} / {p.total_ayahs} آية
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

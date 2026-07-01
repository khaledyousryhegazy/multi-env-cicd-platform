'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function AboutPage() {
  const [mentor, setMentor] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getMentor().then(setMentor).catch((e) => setError(e.message));
  }, []);

  return (
    <main className="section">
      <div className="container">
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--emerald-900)' }}>
          عن المرشد
        </h1>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        {!mentor && !error && <p>جارِ التحميل...</p>}
        {mentor && (
          <div className="card" style={{ marginTop: 20, maxWidth: 640 }}>
            <h2 style={{ color: 'var(--emerald-800)' }}>{mentor.name}</h2>
            <p style={{ lineHeight: 1.9 }}>{mentor.bio || 'لا توجد نبذة تعريفية بعد.'}</p>
            <p style={{ color: '#7a7566', fontSize: 14 }}>{mentor.email}</p>
          </div>
        )}
      </div>
    </main>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

const DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export default function ReservationsPage() {
  const [availability, setAvailability] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', booking_date: '', slot: '', notes: '' });
  const [status, setStatus] = useState({ loading: false, error: '', success: false });

  useEffect(() => {
    api.getAvailability().then(setAvailability).catch(() => {});
  }, []);

  const selectedDayOfWeek = form.booking_date ? new Date(form.booking_date).getDay() : null;
  const slotsForDay = availability.filter((a) => a.day_of_week === selectedDayOfWeek);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.slot) {
      setStatus({ loading: false, error: 'من فضلك اختر موعداً متاحاً', success: false });
      return;
    }
    setStatus({ loading: true, error: '', success: false });
    try {
      const student = await api.createStudent({ name: form.name, email: form.email, phone: form.phone });
      const [start_time, end_time] = form.slot.split('|');
      const mentor = await api.getMentor();
      await api.createBooking({
        student_id: student.id,
        mentor_id: mentor.id,
        booking_date: form.booking_date,
        start_time,
        end_time,
        notes: form.notes,
      });
      setStatus({ loading: false, error: '', success: true });
      setForm({ name: '', email: '', phone: '', booking_date: '', slot: '', notes: '' });
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: false });
    }
  }

  return (
    <main className="section">
      <div className="container">
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--emerald-900)' }}>
          حجز موعد
        </h1>

        <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 520, marginTop: 20 }}>
          <div className="field">
            <label>الاسم الكامل</label>
            <input required value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>
          <div className="field">
            <label>البريد الإلكتروني</label>
            <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
          </div>
          <div className="field">
            <label>رقم الهاتف (اختياري)</label>
            <input value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          </div>
          <div className="field">
            <label>تاريخ الموعد</label>
            <input
              required
              type="date"
              value={form.booking_date}
              onChange={(e) => update('booking_date', e.target.value)}
            />
          </div>

          {form.booking_date && (
            <div className="field">
              <label>
                الأوقات المتاحة يوم {DAYS[selectedDayOfWeek]}
              </label>
              {slotsForDay.length === 0 && <p style={{ color: '#7a7566' }}>لا توجد مواعيد متاحة في هذا اليوم</p>}
              <select value={form.slot} onChange={(e) => update('slot', e.target.value)}>
                <option value="">اختر موعداً</option>
                {slotsForDay.map((s) => (
                  <option key={s.id} value={`${s.start_time}|${s.end_time}`}>
                    {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="field">
            <label>ملاحظات (اختياري)</label>
            <textarea rows={3} value={form.notes} onChange={(e) => update('notes', e.target.value)} />
          </div>

          {status.error && <p style={{ color: 'crimson' }}>{status.error}</p>}
          {status.success && <p style={{ color: 'var(--emerald-700)' }}>تم إرسال طلب الحجز بنجاح ✅</p>}

          <button type="submit" className="btn btn-gold" disabled={status.loading}>
            {status.loading ? 'جارِ الإرسال...' : 'تأكيد الحجز'}
          </button>
        </form>
      </div>
    </main>
  );
}

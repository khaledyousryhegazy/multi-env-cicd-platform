export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>أكاديمية نور القرآن</h1>
          <p>
            رحلة حفظ متقنة برفقة مرشد متخصص، متابعة أسبوعية لتقدمك، وحجز مواعيد
            الجلسات بكل سهولة.
          </p>
          <div style={{ marginTop: 28 }}>
            <a href="/reservations" className="btn btn-gold">احجز موعدك الأول</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            <div className="card">
              <h3>📖 تتبع التقدم</h3>
              <p>راجع حالة حفظك في السور الـ114 وتابع تطورك أولاً بأول.</p>
            </div>
            <div className="card">
              <h3>🗓️ حجز مرن</h3>
              <p>اختر الموعد المناسب لك من جدول توفر المرشد الأسبوعي.</p>
            </div>
            <div className="card">
              <h3>👤 إشراف مباشر</h3>
              <p>متابعة شخصية من المرشد لضبط التلاوة والتثبيت.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

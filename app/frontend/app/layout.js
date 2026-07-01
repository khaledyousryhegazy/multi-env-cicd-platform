import './globals.css';

export const metadata = {
  title: 'أكاديمية نور القرآن | Nur Al-Quran Academy',
  description: 'منصة إرشاد وتحفيظ القرآن الكريم',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <nav className="navbar">
          <div className="container">
            <a href="/" className="brand">نور القرآن</a>
            <div className="nav-links">
              <a href="/">الرئيسية</a>
              <a href="/about">عن المرشد</a>
              <a href="/reservations">حجز موعد</a>
              <a href="/progress">تقدم الحفظ</a>
              <a href="/dashboard">لوحة المرشد</a>
            </div>
          </div>
        </nav>
        {children}
        <footer className="footer">
          <div className="container">
            © {new Date().getFullYear()} أكاديمية نور القرآن — جميع الحقوق محفوظة
          </div>
        </footer>
      </body>
    </html>
  );
}

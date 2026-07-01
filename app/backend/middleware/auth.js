const jwt = require('jsonwebtoken');

function requireMentorAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'غير مصرح - يرجى تسجيل الدخول' });
  }
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.mentor = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'الجلسة غير صالحة أو منتهية' });
  }
}

module.exports = { requireMentorAuth };

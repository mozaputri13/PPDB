// Middleware pembatas frekuensi permintaan (Rate Limiting) untuk pencegahan serangan brute-force
const ipRequestHistory = new Map();

// Pembersihan berkala setiap 10 menit
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of ipRequestHistory.entries()) {
    const valid = timestamps.filter(t => now - t < 15 * 60 * 1000);
    if (valid.length === 0) {
      ipRequestHistory.delete(ip);
    } else {
      ipRequestHistory.set(ip, valid);
    }
  }
}, 10 * 60 * 1000).unref();

export function rateLimiter({
  maxAttempts = 20,
  windowMs = 10 * 60 * 1000,
  message = 'Terlalu banyak upaya akses dalam waktu singkat. Demi keamanan akun, silakan tunggu beberapa menit sebelum mencoba kembali.'
} = {}) {
  return (req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
    const now = Date.now();

    if (!ipRequestHistory.has(clientIp)) {
      ipRequestHistory.set(clientIp, []);
    }

    const clientHistory = ipRequestHistory.get(clientIp).filter(timestamp => now - timestamp < windowMs);
    ipRequestHistory.set(clientIp, clientHistory);

    if (clientHistory.length >= maxAttempts) {
      return res.status(429).json({
        error: message,
        retryAfterMinutes: Math.ceil(windowMs / 60000)
      });
    }

    clientHistory.push(now);
    next();
  };
}

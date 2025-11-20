import crypto from 'crypto';

// Generate a random CSRF token
const generateToken = () => crypto.randomBytes(32).toString('hex');

// CSRF protection middleware (double-submit cookie pattern)
export const csrfProtect = (req, res, next) => {
  // Always ensure a CSRF token exists in cookie
  if (!req.cookies?.csrf_token) {
    const token = generateToken();
    const isSecure = process.env.NODE_ENV === 'production' || req.secure || req.headers['x-forwarded-proto'] === 'https';
    res.cookie('csrf_token', token, {
      httpOnly: false, // Must be accessible from JS
      secure: isSecure,
      sameSite: isSecure ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    req.cookies.csrf_token = token;
  }

  // Skip CSRF check for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Get CSRF token from cookie and header
  const cookieToken = req.cookies?.csrf_token;
  const headerToken = req.headers['x-csrf-token'];

  // Both must be present and match
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({
      error: 'CSRF token validation failed',
      code: 'CSRF_ERROR'
    });
  }

  next();
};


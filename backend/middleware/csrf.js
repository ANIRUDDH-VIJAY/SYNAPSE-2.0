// CSRF protection middleware (double-submit cookie pattern)
export const csrfProtect = (req, res, next) => {
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


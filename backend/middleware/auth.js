const jwt = require('jsonwebtoken');

/**
 * Verify JWT token and extract user/admin information
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Middleware to authenticate admin requests
 */
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login first.',
      });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please login again.',
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message,
    });
  }
};

/**
 * Middleware to authenticate user requests (mobile app)
 */
const userAuthMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login first.',
      });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please login again.',
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message,
    });
  }
};

/**
 * Middleware to check admin role and permissions
 */
const roleMiddleware = (requiredRoles = []) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Admin authentication required.',
      });
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to access this resource.',
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  authMiddleware,
  userAuthMiddleware,
  roleMiddleware,
};

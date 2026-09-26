import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/AdminUser.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. Authentication token required.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'SSCI_DEFAULT_PRODUCTION_JWT_SECRET';
    const decoded = jwt.verify(token, secret);
    const user = await AdminUser.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid or expired session. User not found.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || (!roles.includes(req.user.role) && req.user.role !== 'SUPER ADMIN')) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied. You do not have authorization for this module.',
      });
    }
    next();
  };
};

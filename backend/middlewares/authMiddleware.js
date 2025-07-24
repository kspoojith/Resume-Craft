import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  // Check for JWT token in cookies first (for regular users)
  const token = req.cookies.jwt;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        userId: decoded._id || decoded.userId,  // Extract _id from JWT
        email: decoded.email
      };
      return next();
    } catch (error) {
      // Token is invalid, continue to admin check
    }
  }

  // Admin check for specific routes (like AdminTemplates)
  const adminEmail = "suryapoojith9805@gmail.com";
  const userEmail = req.headers["x-user-email"];

  if (userEmail === adminEmail) {
    req.user = { userId: 'admin', email: adminEmail };
    return next();
  }

  return res.status(401).json({ message: "Unauthorized" });
}

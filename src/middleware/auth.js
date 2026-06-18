const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Missing admin token" });

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid admin token" });
  }
}

module.exports = requireAuth;

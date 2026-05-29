import { conf } from "../config/config.js";
import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, conf.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: error });
  }
}

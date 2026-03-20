import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env["JWT_SECRET"] ?? "fallback-secret-change-me";

interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "No token provided." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (payload.role !== "admin") {
      return res.status(403).json({ error: "Admin access required." });
    }
    (req as Request & { adminUser: JwtPayload }).adminUser = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

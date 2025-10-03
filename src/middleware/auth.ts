import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Extend Express Request with user field
 */
export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

/**
 * Auth Middleware
 */
export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 1️⃣ Get token from header or query param
    let token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token && req.query.token) token = req.query.token as string;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    ) as JwtPayload & { userId: string };

    // 3️⃣ Attach userId to request
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Authentication failed" });
  }
};

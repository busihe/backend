"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Auth Middleware
 */
const auth = (req, res, next) => {
    var _a;
    try {
        // 1️⃣ Get token from header or query param
        let token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        if (!token && req.query.token)
            token = req.query.token;
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        // 2️⃣ Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "fallback_secret");
        // 3️⃣ Attach userId to request
        req.user = { userId: decoded.userId };
        next();
    }
    catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({ message: "Authentication failed" });
    }
};
exports.auth = auth;

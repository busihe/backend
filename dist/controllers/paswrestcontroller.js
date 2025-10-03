"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = void 0;
const OTPmodel_1 = require("../models/OTPmodel"); // Import OTP model
const User_1 = __importDefault(require("../models/User")); // Import User model
const bcryptjs_1 = __importDefault(require("bcryptjs")); // For hashing the new password
// Verify OTP and reset password
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "Email, OTP, and new password are required." });
    }
    // Find the OTP in the database
    const otpRecord = yield OTPmodel_1.OTP.findOne({ email, otp });
    if (!otpRecord) {
        return res.status(400).json({ message: "Invalid OTP." });
    }
    // Check if OTP has expired
    if (Date.now() > otpRecord.expiresAt) {
        return res.status(400).json({ message: "OTP has expired." });
    }
    // Hash the new password
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
    // Find the user and update the password
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }
    user.password = hashedPassword;
    yield user.save();
    // Remove OTP from the database after successful reset
    yield OTPmodel_1.OTP.deleteOne({ email, otp });
    return res.status(200).json({ message: "Password reset successfully." });
});
exports.verifyOTP = verifyOTP;

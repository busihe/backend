import { Request, Response } from "express";
import User from "../models/User";  // Import User model
import bcrypt from "bcryptjs";  // For hashing the new password

// Verify OTP and reset password
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if OTP matches and is not expired
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }
    if (!user.otpExpiration || Date.now() > user.otpExpiration.getTime()) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear OTP fields
    user.resetPasswordOTP = undefined;
    user.otpExpiration = undefined;

    // Save updated user
    await user.save();

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

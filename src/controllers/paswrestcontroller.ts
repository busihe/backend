import { Request, Response } from "express";
import { OTP } from "../models/OTPmodel";  // Import OTP model
import  User from "../models/User";  // Import User model
import bcrypt from "bcryptjs";  // For hashing the new password

// Verify OTP and reset password
export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Email, OTP, and new password are required." });
  }

  // Find the OTP in the database
  const otpRecord = await OTP.findOne({ email, otp });

  if (!otpRecord) {
    return res.status(400).json({ message: "Invalid OTP." });
  }

  // Check if OTP has expired
  if (Date.now() > otpRecord.expiresAt) {
    return res.status(400).json({ message: "OTP has expired." });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Find the user and update the password
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  user.password = hashedPassword;
  await user.save();

  // Remove OTP from the database after successful reset
  await OTP.deleteOne({ email, otp });

  return res.status(200).json({ message: "Password reset successfully." });
};

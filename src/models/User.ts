import mongoose, { Document } from 'mongoose';
import crypto from 'crypto'; // For generating OTP
import moment from 'moment'; // For handling OTP expiration

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role?: 'user' | 'admin'; 
  createdAt: Date;
  resetPasswordOTP?: string; // OTP for password reset
  otpExpiration?: Date; // Expiration time for OTP
  generateResetPasswordOTP(): string; // Method to generate OTP
  validateResetPasswordOTP(otp: string): boolean; // Method to validate OTP
  resetPassword(newPassword: string): Promise<void>; // Method to reset password
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  resetPasswordOTP: { type: String }, // Field to store OTP
  otpExpiration: { type: Date }, // Field for OTP expiration time
});

// Method to generate a reset password OTP
userSchema.methods.generateResetPasswordOTP = function (): string {
  // Generate a random 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  
  // Set expiration time (e.g., 10 minutes)
  const expiration = moment().add(10, 'minutes').toDate();
  
  // Store OTP and expiration time in the user document
  this.resetPasswordOTP = otp;
  this.otpExpiration = expiration;
  
  // Return OTP (to be sent to the user via email or SMS)
  return otp;
};

// Method to validate the reset password OTP
userSchema.methods.validateResetPasswordOTP = function (otp: string): boolean {
  // Check if OTP is valid and not expired
  if (this.resetPasswordOTP === otp && moment().isBefore(this.otpExpiration)) {
    return true;
  }
  return false;
};

// Method to reset the user's password
userSchema.methods.resetPassword = async function (newPassword: string): Promise<void> {
  // Hash the new password (ensure to use a hashing function such as bcrypt in real-world apps)
  this.password = newPassword;
  await this.save();
};

export default mongoose.model<IUser>('User', userSchema);

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
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto")); // For generating OTP
const moment_1 = __importDefault(require("moment")); // For handling OTP expiration
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
    resetPasswordOTP: { type: String }, // Field to store OTP
    otpExpiration: { type: Date }, // Field for OTP expiration time
});
// Method to generate a reset password OTP
userSchema.methods.generateResetPasswordOTP = function () {
    // Generate a random 6-digit OTP
    const otp = crypto_1.default.randomInt(100000, 999999).toString();
    // Set expiration time (e.g., 10 minutes)
    const expiration = (0, moment_1.default)().add(10, 'minutes').toDate();
    // Store OTP and expiration time in the user document
    this.resetPasswordOTP = otp;
    this.otpExpiration = expiration;
    // Return OTP (to be sent to the user via email or SMS)
    return otp;
};
// Method to validate the reset password OTP
userSchema.methods.validateResetPasswordOTP = function (otp) {
    // Check if OTP is valid and not expired
    if (this.resetPasswordOTP === otp && (0, moment_1.default)().isBefore(this.otpExpiration)) {
        return true;
    }
    return false;
};
// Method to reset the user's password
userSchema.methods.resetPassword = function (newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        // Hash the new password (ensure to use a hashing function such as bcrypt in real-world apps)
        this.password = newPassword;
        yield this.save();
    });
};
exports.default = mongoose_1.default.model('User', userSchema);

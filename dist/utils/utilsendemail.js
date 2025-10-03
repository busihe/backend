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
exports.sendOTP = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail", // or use your email service provider
    auth: {
        user: process.env.EMAIL_USER, // Your email (for example, Gmail)
        pass: process.env.EMAIL_PASS, // Your email password or app password
    },
});
const sendOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Your email address
        to: email,
        subject: "Your OTP for Password Reset",
        html: `<h3>Reset Password OTP</h3><p>Your OTP is <strong>${otp}</strong></p>`,
    };
    try {
        yield transporter.sendMail(mailOptions);
        console.log("OTP sent to email:", email);
    }
    catch (error) {
        console.error("Error sending OTP email:", error);
    }
});
exports.sendOTP = sendOTP;

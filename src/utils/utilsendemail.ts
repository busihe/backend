import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // or use your email service provider
  auth: {
    user: process.env.EMAIL_USER,   // Your email (for example, Gmail)
    pass: process.env.EMAIL_PASS,   // Your email password or app password
  },
});

export const sendOTP = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Your email address
    to: email,
    subject: "Your OTP for Password Reset",
    html: `<h3>Reset Password OTP</h3><p>Your OTP is <strong>${otp}</strong></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent to email:", email);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

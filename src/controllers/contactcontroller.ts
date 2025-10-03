import { Contact } from "../models/contactcontrollers";
import { Request, Response } from "express";
import mailerSender from "../utils/SendEmail";
import dotenv from "dotenv";
dotenv.config();

export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ message: "Name, email, and message are required." });
      return;
    }

    // Save contact to DB
    const newContact = await Contact.create({ name, email, phone, message });
    const adminEmail = process.env.ADMIN_EMAIL;

    if (adminEmail) {
      // Admin email template with Tailwind CSS
      await mailerSender(
        adminEmail,
        "New Contact Message",
        `
        <div style="font-family: 'Arial', sans-serif; line-height: 1.5; padding: 20px;">
          <h1 class="text-3xl font-bold text-yellow-600 mb-4">New Contact Message</h1>
          <p class="text-lg mb-2"><strong>Name:</strong> ${name}</p>
          <p class="text-lg mb-2"><strong>Email:</strong> ${email}</p>
          <p class="text-lg mb-2"><strong>Phone:</strong> ${phone || "N/A"}</p>
          <p class="text-lg mb-2"><strong>Message:</strong> ${message}</p>
        </div>
        `
      );
    }

    // Generate OTP (for demonstration, you can generate a real OTP in a real system)
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // OTP example: 6 digits

    // User email template with OTP design and Tailwind CSS
    await mailerSender(
      email,
      "Your Requested OTP for Email Verification",
      `
      <div style="font-family: 'Arial', sans-serif; line-height: 1.5; padding: 20px; background-color: #f9fafb;">
        <div style="text-align: center; padding: 20px;">
          <img src="https://www.rohitchouhan.com/assets/img/lock-icon.png" alt="Lock" style="width: 50px; margin-bottom: 20px;">
          <h2 class="text-3xl font-bold text-yellow-600 mb-4">EMAIL OTP</h2>
          <p class="text-lg mb-4">Your Requested OTP for Email OTP is</p>
          <div style="font-size: 24px; font-weight: bold; color: #fff; background-color: #34D399; padding: 20px 40px; border-radius: 5px; display: inline-block;">
            ${otp}
          </div>
          <p class="mt-6 text-lg">Please enter this OTP to complete your verification.</p>
        </div>
        <footer style="text-align: center; padding-top: 20px; font-size: 12px; color: #aaa;">
          <p>© www.rohitchouhan.com</p>
        </footer>
      </div>
      `
    );

    // Send success response
    res.status(201).json({
      message: "Contact message received successfully.",
      contact: newContact
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error creating contact message:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

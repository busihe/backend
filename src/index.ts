import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import cors from "cors";
import connectDB from "./config/db";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

// Import your routes
import productRoutes from "./routes/product.routes";
import authRoutes from "./routes/userRouter"; // This is where your auth routes (including OTP) are defined
import orderRoutes from "./routes/orderRoutes"; 
import cartRoutes from "./routes/cart.routes";
import subscribeRoutes from "./routes/subscribeRoutes";
import contactRoutes from "./routes/contactRoutes"; // Import the contact routes
// Import OTP routes
import userRoutes from './routes/userRouter'; // Import OTP route for user management (password reset)

// Create an Express app instance
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define your routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/subscribe", subscribeRoutes);
app.use("/api/contact", contactRoutes); // Add the contact route

// Integrating User Routes (for registration, login, password reset, OTP handling)
app.use("/api/users", userRoutes);  // Add the user route for authentication and OTP

// Server setup
const PORT = process.env.PORT || 5000;

connectDB(); // Assuming you have a connectDB function to handle database connection

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

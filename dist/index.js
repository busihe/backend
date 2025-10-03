"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./swagger");
// Import your routes
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const userRouter_1 = __importDefault(require("./routes/userRouter")); // This is where your auth routes (including OTP) are defined
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const subscribeRoutes_1 = __importDefault(require("./routes/subscribeRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes")); // Import the contact routes
// Import OTP routes
const userRouter_2 = __importDefault(require("./routes/userRouter")); // Import OTP route for user management (password reset)
// Create an Express app instance
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Swagger docs
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Define your routes
app.use("/api/products", product_routes_1.default);
app.use("/api/auth", userRouter_1.default);
app.use("/api/orders", orderRoutes_1.default);
app.use("/api/cart", cart_routes_1.default);
app.use("/api/subscribe", subscribeRoutes_1.default);
app.use("/api/contact", contactRoutes_1.default); // Add the contact route
// Integrating User Routes (for registration, login, password reset, OTP handling)
app.use("/api/users", userRouter_2.default); // Add the user route for authentication and OTP
// Server setup
const PORT = process.env.PORT || 5000;
(0, db_1.default)(); // Assuming you have a connectDB function to handle database connection
// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactcontroller_1 = require("../controllers/contactcontroller");
const contactRouter = (0, express_1.Router)();
// Route to create a new contact message
contactRouter.post("/", contactcontroller_1.createContact);
// You can add more routes later, e.g., get all messages, delete, etc.
exports.default = contactRouter;

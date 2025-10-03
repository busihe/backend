import { Router } from "express";
import { createContact } from "../controllers/contactcontroller";
const contactRouter = Router();
// Route to create a new contact message
contactRouter.post("/", createContact);
// You can add more routes later, e.g., get all messages, delete, etc.
export default contactRouter;
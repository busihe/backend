import express from "express";
import { subscribe, getSubscribers, deleteSubscriber } from "../controllers/subscribeController";
import { validateEmail } from "../middleware/validateEmail";

const router = express.Router();

router.post("/", validateEmail, subscribe);
router.get("/", getSubscribers);             
router.delete("/:id", deleteSubscriber);    

export default router;

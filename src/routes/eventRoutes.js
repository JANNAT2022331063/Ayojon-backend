import express from "express";
import { protect, organizerOnly } from "../middleware/auth.js";
import { createEvent, updateEvent, deleteEvent, listEvents } from "../controllers/eventController.js";

const router = express.Router();

router.get("/", listEvents); // public
router.post("/", protect, organizerOnly, createEvent);
router.put("/:id", protect, organizerOnly, updateEvent);
router.delete("/:id", protect, organizerOnly, deleteEvent);

export default router;

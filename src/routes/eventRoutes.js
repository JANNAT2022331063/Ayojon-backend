import express from "express";
import { createEvent, deleteEvent, upload } from "../controllers/eventController.js";

const router = express.Router();

// Create Event
router.post(
  "/",
  upload.fields([
    { name: "proof_file", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  createEvent
);

// Delete Event
router.delete("/:id", deleteEvent);

export default router;

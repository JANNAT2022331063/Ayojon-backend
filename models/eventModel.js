import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: String, required: true },
  location: String,
  organizer: String
});

const Event = mongoose.model("Event", eventSchema);
export default Event;

// src/controllers/eventController.js
import Event from "../models/Event.js";
import { Op } from "sequelize";

// List events with optional query (date, search, pagination)
export const listEvents = async (req, res) => {
  try {
    const { q, date, page = 1, limit = 12 } = req.query;
    const where = {};
    if (q) where.title = { [Op.like]: `%${q}%` };
    if (date) where.date = date; // prefer exact match or add range logic

    const offset = (page - 1) * limit;
    const { rows, count } = await Event.findAndCountAll({
      where,
      order: [["date", "ASC"]],
      limit: +limit,
      offset: +offset
    });
    res.json({ events: rows, total: count, page: +page });
  } catch (err) {
    res.status(500).json({ msg: "Failed to list events", error: err.message });
  }
};

export const getEvent = async (req, res) => {
  try {
    const ev = await Event.findByPk(req.params.id);
    if (!ev) return res.status(404).json({ msg: "Event not found" });
    res.json(ev);
  } catch (err) {
    res.status(500).json({ msg: "Failed to get event", error: err.message });
  }
};

// Organizer creates event
export const createEvent = async (req, res) => {
  try {
    const data = req.body;
    // attach organizerId from authenticated user
    data.organizerId = req.user.id;
    const created = await Event.create(data);
    res.status(201).json({ msg: "Event created", event: created });
  } catch (err) {
    res.status(400).json({ msg: "Create failed", error: err.message });
  }
};

// Organizer updates event (only if owner or admin)
export const updateEvent = async (req, res) => {
  try {
    const ev = await Event.findByPk(req.params.id);
    if (!ev) return res.status(404).json({ msg: "Event not found" });
    // only organizer or admin
    if (ev.organizerId !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ msg: "Not allowed" });
    await ev.update(req.body);
    res.json({ msg: "Event updated", event: ev });
  } catch (err) {
    res.status(400).json({ msg: "Update failed", error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const ev = await Event.findByPk(req.params.id);
    if (!ev) return res.status(404).json({ msg: "Event not found" });
    if (ev.organizerId !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ msg: "Not allowed" });
    await ev.destroy();
    res.json({ msg: "Event deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed", error: err.message });
  }
};

const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const userMiddleware = require("../middleware/userMiddleware");
const {
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getAllEvents,
    getMyEvents,
} = require("../controllers/eventController");

// Admin only
router.post("/create", adminMiddleware, createEvent);
router.put("/update/:id", adminMiddleware, updateEvent);
router.delete("/delete/:id", adminMiddleware, deleteEvent);
router.get("/my-events", adminMiddleware, getMyEvents);

// Authenticated users
router.get("/all", getAllEvents);
router.get("/:id", userMiddleware, getEventById);

module.exports = router;
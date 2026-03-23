const express = require("express");
const router = express.Router();
const userMiddleware = require("../middleware/userMiddlewere");
const adminMiddleware = require("../middleware/adminMiddlewere");
const {
    registerForEvent,
    cancelRegistration,
    getUserEvents,
    getEventAttendees,
} = require("../controllers/registrationController");

router.post("/register/:eventId", userMiddleware, registerForEvent);
router.delete("/cancel/:eventId", userMiddleware, cancelRegistration);
router.get("/my-events", userMiddleware, getUserEvents);
router.get("/attendees/:eventId", adminMiddleware, getEventAttendees);

module.exports = router;
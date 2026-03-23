const Event = require("../models/event");
const Registration = require("../models/registration");
const User = require("../models/user");
const mongoose = require("mongoose");

exports.registerForEvent = async (req, res) => {
    const userId = req.result._id;
    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ message: "Invalid Event ID format" });
    }

    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        const registeredCount = await Registration.countDocuments({
            eventId,
            status: "registered",
        });
        if (registeredCount >= event.capacity) {
            return res.status(400).json({ message: "Event is full" });
        }

        const existing = await Registration.findOne({ userId, eventId });
        if (existing) {
            if (existing.status === "cancelled") {
                existing.status = "registered";
                await existing.save();
                await User.findByIdAndUpdate(userId, {
                    $addToSet: { eventsAttending: eventId },
                });
                return res.status(200).json({ message: "Re-registered successfully" });
            }
            return res.status(400).json({ message: "Already registered" });
        }

        const registration = await Registration.create({ userId, eventId });
        await User.findByIdAndUpdate(userId, {
            $addToSet: { eventsAttending: eventId },
        });
        res.status(201).json({ message: "Registered successfully", registration });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.cancelRegistration = async (req, res) => {
    const userId = req.result._id;
    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ message: "Invalid Event ID format" });
    }

    try {
        const registration = await Registration.findOneAndUpdate(
            { userId, eventId, status: "registered" },
            { status: "cancelled" },
            { new: true }
        );
        if (!registration)
            return res.status(404).json({ message: "Registration not found" });

        await User.findByIdAndUpdate(userId, {
            $pull: { eventsAttending: eventId },
        });
        res.status(200).json({ message: "Cancelled registration" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserEvents = async (req, res) => {
    const userId = req.result._id;
    try {
        const registrations = await Registration.find({
            userId,
            status: "registered",
        }).populate("eventId");
        const events = registrations.map((r) => r.eventId);
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getEventAttendees = async (req, res) => {
    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ message: "Invalid Event ID format" });
    }
    
    try {
        const registrations = await Registration.find({
            eventId,
            status: "registered",
        }).populate("userId", "firstName lastName emailId");
        res.status(200).json(registrations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
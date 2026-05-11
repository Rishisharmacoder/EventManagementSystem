const Event = require("../models/event");
const Registration = require("../models/registration");
const User = require("../models/user");
const mongoose = require("mongoose");

exports.createEvent = async (req, res) => {
    try {
        const event = await Event.create({
            ...req.body,
            createdBy: req.result._id,
        });
        res.status(201).json({ message: "Event created", event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Event ID format" });
    }
    try {
        if (req.body.createdBy) delete req.body.createdBy;
        const event = await Event.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.status(200).json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteEvent = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Event ID format" });
    }
    try {
        const event = await Event.findByIdAndDelete(id);
        if (!event) return res.status(404).json({ message: "Event not found" });
        await Registration.deleteMany({ eventId: id });
        await User.updateMany(
            { eventsAttending: id },
            { $pull: { eventsAttending: id } }
        );
        res.status(200).json({ message: "Event deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getEventById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Event ID format" });
    }
    try {
        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ message: "Event not found" });
        
        const registeredCount = await Registration.countDocuments({
            eventId: id,
            status: "registered",
        });
        
        res.status(200).json({ ...event.toObject(), registeredCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const { category, date, page = 1, limit = 6 } = req.query;
        let filter = {};
        if (category) filter.category = category;
        if (date) filter.date = { $gte: new Date(date) };
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const events = await Event.find(filter)
            .sort({ date: 1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const totalEvents = await Event.countDocuments(filter);
        
        const eventsWithCount = await Promise.all(events.map(async (event) => {
            const registeredCount = await Registration.countDocuments({
                eventId: event._id,
                status: "registered",
            });
            return { ...event.toObject(), registeredCount };
        }));
        
        res.status(200).json({
            events: eventsWithCount,
            totalPages: Math.ceil(totalEvents / parseInt(limit)),
            currentPage: parseInt(page)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMyEvents = async (req, res) => {
    try {
        const events = await Event.find({ createdBy: req.result._id });
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
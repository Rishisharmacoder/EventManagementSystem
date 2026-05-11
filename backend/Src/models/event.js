const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: 'https://picsum.photos/seed/event/800/400'
        },
        imagePublicId: {
            type: String,
            default: null
        },
        video: {
            type: String,
            default: null
        },
        videoPublicId: {
            type: String,
            default: null
        },
        date: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
            min: 1,
        },
        registeredCount: {
            type: Number,
            default: 0
        },
        category: {
            type: String,
            enum: ["conference", "workshop", "meetup", "webinar", "other"],
            default: "other",
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
    },
    { timestamps: true }
);

const Event = mongoose.model("event", eventSchema);
module.exports = Event; 
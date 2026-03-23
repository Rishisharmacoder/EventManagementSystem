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
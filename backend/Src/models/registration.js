const mongoose = require("mongoose");
const { Schema } = mongoose;

const registrationSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "event",
            required: true,
        },
        status: {
            type: String,
            enum: ["registered", "cancelled"],
            default: "registered",
        },
        registeredAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

const Registration = mongoose.model("registration", registrationSchema);
module.exports = Registration;
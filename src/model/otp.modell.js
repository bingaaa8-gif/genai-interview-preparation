
const mongoose = require("mongoose");

const otpschema = new mongoose.Schema({
    otphash: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    email: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

const otpModel = mongoose.model("otp", otpschema);

module.exports = otpModel;

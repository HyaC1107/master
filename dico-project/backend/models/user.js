const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    authed: Boolean,
    sid: String
});

module.exports = mongoose.model("user", userSchema);
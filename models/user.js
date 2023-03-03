const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Review = require("./review.js");
const Campground = require("./campground.js");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    email: String,
    phone: Number,
    address: String,
    Age: Number,
    Hobbies: String,
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
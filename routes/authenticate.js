const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require("../models/user.js");
const catchAsync = require("../utils/catchAsync");

router.post("/register", catchAsync(async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    if (user) {
        req.flash('error', 'the username is already taken');
        res.redirect("/campgrounds");
    } else {
        var newUser = new User({ 
            username: req.body.username, 
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        });
        await User.register(newUser, req.body.password);
        passport.authenticate("local")(req, res, function() {
            req.flash('success', 'A new user has been successfully added');
            res.redirect("/campgrounds");
        });
    };
}));

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/campgrounds",
    failureFlash: "invalid username or password",
    successFlash: "successfully logged you in",
}), (req, res) => {
    res.send("Log In");
});

router.get("/logout", (req,res) => {
    req.flash("success", "successfully logged you out");
    req.logOut();
    res.redirect("/");
});


module.exports = router;
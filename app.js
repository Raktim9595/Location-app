// if (process.env.NODE_ENV !== "production") {
//     require('dotenv').config();
// };

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const path = require('path');

const campgroundRoutes = require("./routes/campground.js");
const ExpressError = require("./utils/expressError.js");
const reviewRoutes = require("./routes/reviews.js");
const authRoutes = require("./routes/authenticate.js");
const userRoutes = require("./routes/userRoutes.js");
const User = require("./models/user.js");

const app = express();
const port = process.env.PORT || 80;

app.locals.moment = require("moment");
app.use(session({
    secret: "my name is raktim",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000*60*60*24*7),
        maxAge: 1000*60*60*24*7,
    }
}));
app.use(flash());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    next();
});

mongoose.connect("mongodb://127.0.0.1:27017/Yelpcamp_v3", {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
.then(() => {
    console.log("connected to the database")
})
.catch(() => {
    console.log("sorry couldnot connect to the database");
});

app.get("/", (req, res) => {
    res.render("landing");
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/users/:id", userRoutes);
app.use(authRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('page not found', 404));
});

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = "something went wrong!!";
    res.status(status).render('error', { err });
});

app.listen(port, (req, res) => {
    console.log("connected in port " + port);
});
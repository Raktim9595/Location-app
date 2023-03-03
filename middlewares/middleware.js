const Campground = require("../models/campground.js");

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('error', 'you must be logged in to do that');
        res.redirect("/campgrounds");
    };
};

const reviewLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("error", "you must be logged in to do that");
        res.redirect(`/campgrounds/${req.params.id}`);
    }
}

const isCampgroundAuthor = async (req, res, next) => {
    const { id } = req.params;
    if (req.isAuthenticated()) {
        const foundCamp = await (Campground.findById(id));
        if (foundCamp.author.id.equals(req.user._id)) {
            next();
        } else {
            req.flash("error", "sorry you don't have permission to do that");
            res.redirect(`/campgrounds/${id}`);
        }
    } else {
        req.flash("error", "you need to be logged in to do that");
        res.redirect(`/campgrounds/${id}`);
    }
};

module.exports = {
    isLoggedIn,
    reviewLoggedIn,
    isCampgroundAuthor,
};
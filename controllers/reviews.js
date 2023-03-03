const Campground = require("../models/campground.js");
const Review = require("../models/review.js");

const createReview = async (req, res, next) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id);
    let review = new Review(req.body.review);
    foundCampground.reviews.push(review);
    review.author.username = req.user.username;
    review.author.id = req.user._id;
    await foundCampground.save();
    await review.save();
    req.flash('success', 'successfully created a review');
    res.redirect(`/campgrounds/${id}`);
};

const showEditForm = async (req, res) => {
    const { id, reviewId } = req.params;
    const foundReview = await Review.findById(reviewId);
    res.render("campgrounds/reviewEdit", { foundReview: foundReview, campgroundId: id });
};

const editReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndUpdate(reviewId, req.body.review);
    req.flash('success', 'successfully edited the review');
    res.redirect(`/campgrounds/${id}`);
};

const deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'successfully deleted a review');
    res.redirect(`/campgrounds/${id}`);
};

module.exports = {
    createReview,
    editReview,
    deleteReview,
    showEditForm,
}
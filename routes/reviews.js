const express = require('express');
const router = express.Router({ mergeParams: true });

const { reviewSchema } = require("../schemas.js");
const catchAsync = require("../utils/catchAsync.js");
const ExpressError = require('../utils/expressError.js');
const { reviewLoggedIn } = require("../middlewares/middleware.js");
const review = require("../controllers/reviews.js");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(err => err.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    };
};

router.post("/",reviewLoggedIn, validateReview, catchAsync(review.createReview));

router.get("/:reviewId/edit", reviewLoggedIn, catchAsync(review.showEditForm))

router.put("/:reviewId", reviewLoggedIn, catchAsync(review.editReview));

router.delete("/:reviewId", reviewLoggedIn, catchAsync(review.deleteReview));

module.exports = router;
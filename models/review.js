const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema ({
    rating: Number,
    body: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
        },
        username: String,
    },
});

const Review = mongoose.model("Reviews", reviewSchema);
module.exports = Review;
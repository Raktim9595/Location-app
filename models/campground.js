const mongoose = require('mongoose');

const Review = require("./review.js");

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String,
});
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace("/upload", "/upload/w_350");
});

const campgroundSchema = new mongoose.Schema({
    name: String,
    images: [ImageSchema],
    price: String,
    location: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            require: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
        },
        username: String,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reviews",
        },
    ]
});

campgroundSchema.post("findOneAndDelete", async doc => {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    };
});

campgroundSchema.path('images').validate(function (value) {
    if (value.length === 0) {
        throw new Error("please select at least one image");
    } else if (value.length >6) {
      throw new Error("you cannot upload more than 6 images");
    };
});

const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;
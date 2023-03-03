const joi = require('joi');

const campgroundSchema = joi.object({
    campground: joi.object({
        name: joi.string().required(),
        location: joi.string().required(),
        price: joi.number().required().min(0),
        description: joi.string().required()
    }).required(),
    deleteImages: joi.array(),
});

const reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required(),
        body: joi.string().required(),
    }).required()
});

module.exports = {
    campgroundSchema: campgroundSchema,
    reviewSchema: reviewSchema,
}
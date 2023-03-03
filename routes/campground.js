const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require("../cloudinary/index.js");
const upload = multer({ storage });

const catchAsync = require("../utils/catchAsync.js");
const ExpressError = require('../utils/expressError.js');
const { campgroundSchema } = require("../schemas.js");
const { isLoggedIn, isCampgroundAuthor } = require("../middlewares/middleware.js");
const campground = require("../controllers/campground.js");

const validateCampground = (req, res,next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(err => err.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    };
};

router.get("/", catchAsync(campground.index));

router.get("/new", isLoggedIn, campground.renderNewCampgroundForm);

router.post("/", isLoggedIn, upload.array("image"), validateCampground, catchAsync(campground.createNewCampground));

router.get("/:id", catchAsync(campground.showCampground));

router.get("/:id/edit", isCampgroundAuthor, catchAsync(campground.showEditForm));

router.put("/:id", isCampgroundAuthor, upload.array("image"), validateCampground, catchAsync(campground.editCampground));

router.delete("/:id", isCampgroundAuthor, upload.array("image") , catchAsync(campground.deleteCampground));

module.exports = router;
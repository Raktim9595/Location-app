const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding.js");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });

const Campground = require("../models/campground.js");
const { cloudinary } = require("../cloudinary/index.js");

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const index = async (req, res) => {
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        let queryCampground = await Campground.find({$or: [{"name":regex}, {"author.username":regex}]});
        res.render("campgrounds", { campgrounds: queryCampground });
    } else {
        let campgrounds = await Campground.find({});
        res.render("campgrounds", { campgrounds });
    }
};

const renderNewCampgroundForm = (req, res) => {
    res.render("campgrounds/new");
};

const createNewCampground = async (req, res) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1,
    }).send();
    let campground = new Campground(req.body.campground);
    let author = {
        id: req.user._id,
        username: req.user.username,
    };
    console.log(req.files);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = author;
    campground.geometry = geoData.body.features[0].geometry;
    await campground.
    req.flash('success', 'successfully created a campground');
    res.redirect("/campgrounds");
};

const showCampground = async (req, res) => {
    const foundCampground = await Campground.findById(req.params.id).populate('reviews');
    if (!foundCampground) {
        req.flash('error', 'Sorry the campground cannot be found');
        return res.redirect("/campgrounds");
    };
    res.render("campgrounds/show", { foundCampground });
};

const showEditForm = async (req, res) => {
    let foundCampground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground: foundCampground });
};

const editCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1,
    }).send();
    campground.geometry = geoData.body.features[0].geometry;
    const newImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...newImages);
    await campground.save();
    console.log(req.body.deleteImages);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        };
        await campground.updateOne({ $pull: {images: { filename: {$in: req.body.deleteImages} }} });
    };
    req.flash('success', `successfully updated a campground`);
    res.redirect("/campgrounds/" + id);
};

const deleteCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    for (let value of campground.images) {
        await cloudinary.uploader.destroy(value.filename);
    };
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('error', 'Successfully deleted a campground');
    res.redirect("/campgrounds");
};

module.exports = {
    index,
    renderNewCampgroundForm,
    createNewCampground,
    showCampground,
    showEditForm,
    editCampground,
    deleteCampground
};
const faker = require('faker');
const User = require("../models/user");
const Campground = require("../models/campground.js");
const { cloudinary } = require("../cloudinary/index.js");

const getUser = async(req, res) => {
  let id = req.params.id;
  let avatar = faker.image.avatar();
  let currentSignedIn = await User.findOne({username: id});
  let allLocations = await Campground.find({});
  let neededLocations = allLocations.filter(camp => {
    return camp.author.username === id;
  });
  res.render("users", {user: currentSignedIn, avatar: avatar, foundCampground: neededLocations });
}

const deleteUser = async(req, res) => {
  let id = req.params.id;
  const allCampgrounds = await Campground.find({});
  const needed = allCampgrounds.filter(camp => {
    return camp.author.username === id;
  });
  needed.forEach(async camp => {
    for (let value of camp.images) {
      await cloudinary.uploader.destroy(value.filename);
    };
    await Campground.findByIdAndDelete(camp._id);
  });
  await User.findOneAndDelete({ username: id });
  res.redirect("/");
}

module.exports = {
  getUser,
  deleteUser
}
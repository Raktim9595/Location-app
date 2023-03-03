const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router({ mergeParams: true });
const user = require("../controllers/users");
const { isLoggedIn } = require("../middlewares/middleware.js");

router.get("/", isLoggedIn, catchAsync(user.getUser));

router.delete("/", isLoggedIn, catchAsync(user.deleteUser))

module.exports = router;
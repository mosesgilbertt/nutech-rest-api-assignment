const BannerController = require("../controllers/banner.controller");

const banner = require("express").Router();

banner.get("/", BannerController.getAllBanner);

module.exports = banner;

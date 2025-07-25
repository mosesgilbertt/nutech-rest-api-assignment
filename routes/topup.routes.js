const TopupController = require("../controllers/topup.controller");
const authentication = require("../middlewares/authentication");

const topup = require("express").Router();

topup.post("/", authentication, TopupController.createTopup);

module.exports = topup;

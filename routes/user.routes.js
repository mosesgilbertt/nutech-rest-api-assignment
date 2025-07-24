const UserController = require("../controllers/user.controller");

const user = require("express").Router();

user.post("/registration", UserController.registration);

module.exports = user;

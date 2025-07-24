const UserController = require("../controllers/user.controller");

const user = require("express").Router();

user.post("/registration", UserController.registration);

user.post("/login", UserController.login);

module.exports = user;

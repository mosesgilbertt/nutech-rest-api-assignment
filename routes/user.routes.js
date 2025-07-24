const UserController = require("../controllers/user.controller");
const authentication = require("../middlewares/authentication");

const user = require("express").Router();

user.post("/registration", UserController.registration);
user.post("/login", UserController.login);

user.get("/profile", authentication, UserController.profile);
user.put("/profile/update", authentication, UserController.updateProfile);

module.exports = user;

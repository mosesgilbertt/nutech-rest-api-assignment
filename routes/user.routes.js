const UserController = require("../controllers/user.controller");
const authentication = require("../middlewares/authentication");
const upload = require("../middlewares/uploadCloudinary");

const user = require("express").Router();

user.post("/registration", UserController.registration);
user.post("/login", UserController.login);

user.get("/profile", authentication, UserController.profile);
user.put("/profile/update", authentication, UserController.updateProfile);
user.put(
  "/profile/image",
  authentication,
  upload.single("file"),
  UserController.updateProfileImage
);

module.exports = user;

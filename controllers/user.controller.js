const UserModel = require("../models/user.model");

class UserController {
  static async registration(req, res, next) {
    try {
      const userData = req.body;

      await UserModel.createUser(userData);

      res.status(200).json({
        status: 0,
        message: "Registrasi berhasil silahkan login",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;

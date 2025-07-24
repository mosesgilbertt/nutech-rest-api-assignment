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

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        throw {
          name: "BadRequest",
          message: "Parameter email tidak sesuai format",
        };
      }

      if (!password) {
        throw {
          name: "BadRequest",
          message: "Parameter password tidak boleh kosong",
        };
      }

      const token = await UserModel.login(email, password);

      res.status(200).json({
        status: 0,
        message: "Login Sukses",
        data: {
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;

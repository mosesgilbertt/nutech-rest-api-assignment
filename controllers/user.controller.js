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

  static async profile(req, res, next) {
    try {
      const userId = req.user.id;

      const userProfile = await UserModel.findById(userId);

      if (!userProfile) {
        throw {
          name: "NotFound",
          message: "User not found",
        };
      }

      res.status(200).json({
        status: 0,
        message: "Sukses",
        data: {
          email: userProfile.email,
          first_name: userProfile.first_name,
          last_name: userProfile.last_name,
          profile_picture: userProfile.profile_picture,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const { first_name, last_name } = req.body;

      const updatedUser = await UserModel.updateProfile(userId, {
        first_name,
        last_name,
      });

      res.status(200).json({
        status: 0,
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfileImage(req, res, next) {
    try {
      const userId = req.user.id;

      if (!req.file || !req.file.path) {
        throw {
          name: "BadRequest",
          message: "Format Image tidak sesuai",
        };
      }

      const updatedUser = await UserModel.updateProfileImage(
        userId,
        req.file.path
      );

      res.status(200).json({
        status: 0,
        message: "Update Profile Image berhasil",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;

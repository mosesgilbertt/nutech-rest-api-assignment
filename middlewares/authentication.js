const { verifyToken } = require("../helpers/jwt");
const UserModel = require("../models/user.model");

async function authentication(req, res, next) {
  const { authorization } = req.headers;
  try {
    if (!authorization) {
      throw {
        name: "Unauthorized",
        message: "Token tidak tidak valid atau kadaluwarsa",
      };
    }

    const rawToken = authorization.split(" ");
    if (rawToken[0] !== "Bearer" || !rawToken[1]) {
      throw {
        name: "Unauthorized",
        message: "Token tidak tidak valid atau kadaluwarsa",
      };
    }

    const data = verifyToken(rawToken[1]);

    const user = await UserModel.findById(data.id);

    if (!user) {
      throw {
        name: "Unauthorized",
        message: "Token tidak tidak valid atau kadaluwarsa",
      };
    }

    req.user = {
      id: user.id,
    };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authentication;

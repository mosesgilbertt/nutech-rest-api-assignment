const db = require("../db/connection");
const Joi = require("joi");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

class UserModel {
  static async createUser(userData) {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.email": "Parameter email tidak sesuai format",
        "any.required": "Email tidak boleh kosong",
      }),

      first_name: Joi.string().min(1).required().messages({
        "any.required": "First name tidak boleh kosong",
        "string.empty": "First name tidak boleh kosong",
      }),

      last_name: Joi.string().min(1).required().messages({
        "any.required": "Last name tidak boleh kosong",
        "string.empty": "Last name tidak boleh kosong",
      }),

      password: Joi.string().min(6).required().messages({
        "string.min": "Password minimal 6 karakter",
        "any.required": "Password tidak boleh kosong",
      }),
    });

    const { error } = schema.validate(userData, { abortEarly: false });

    if (error) {
      const validationError = {
        name: "ValidationError",
        message: error.details.map((detail) => detail.message),
      };
      throw validationError;
    }

    const hashedPassword = hashPassword(userData.password);

    const query = `
    INSERT INTO
      "Users" (email, first_name, last_name, password, profile_picture)
    VALUES
      ($1, $2, $3, $4, $5)
    RETURNING
      id, email, first_name, last_name
    `;
    const values = [
      userData.email,
      userData.first_name,
      userData.last_name,
      hashedPassword,
      "https://i.pinimg.com/736x/84/64/82/8464826d795c3a32fff669b37aba806d.jpg",
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async login(email, password) {
    const query = `
    SELECT
      id, email, first_name, last_name, password
    FROM
      "Users"
    WHERE
      email = $1
    `;
    const values = [email];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      throw {
        name: "Unauthorized",
        message: "Email atau password salah",
      };
    }

    const user = result.rows[0];

    const isValidPassword = comparePassword(password, user.password);
    if (!isValidPassword) {
      throw {
        name: "Unauthorized",
        message: "Email atau password salah",
      };
    }

    const token = signToken({
      id: user.id,
    });

    return token;
  }

  static async findById(id) {
    const query = `
    SELECT
      id, email, first_name, last_name, profile_picture
    FROM
      "Users"
    WHERE
      id = $1
    `;
    const values = [id];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async updateProfile(userId, updateData) {
    const schema = Joi.object({
      first_name: Joi.string().min(1).required().messages({
        "any.required": "First name tidak boleh kosong",
        "string.empty": "First name tidak boleh kosong",
      }),
      last_name: Joi.string().min(1).required().messages({
        "any.required": "Last name tidak boleh kosong",
        "string.empty": "Last name tidak boleh kosong",
      }),
    });

    const { error } = schema.validate(updateData, { abortEarly: false });

    if (error) {
      const validationError = {
        name: "ValidationError",
        msg: error.details.map((detail) => detail.message),
      };
      throw validationError;
    }

    const query = `
    UPDATE
      "Users"
    SET
      first_name = $1, last_name = $2
    WHERE
      id = $3
    RETURNING
      email, first_name, last_name, profile_picture
    `;
    const values = [updateData.first_name, updateData.last_name, userId];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async updateProfileImage(userId, imageUrl) {
    if (!imageUrl.match(/\.(jpg|jpeg|png)$/i)) {
      throw {
        name: "BadRequest",
        message: "Format Image tidak sesuai",
      };
    }

    const query = `
    UPDATE
      "Users"
    SET
      profile_picture = $1
    WHERE
      id = $2
    RETURNING 
      email, first_name, last_name, profile_picture
  `;

    const values = [imageUrl, userId];
    const result = await db.query(query, values);

    return result.rows[0];
  }
}

module.exports = UserModel;

const db = require("../db/connection");
const { hashPassword } = require("../helpers/bcrypt");
const Joi = require("joi");

class UserModel {
  static async createUser(userData) {
    // Schema validasi dengan Joi
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.email": "Parameter email tidak sesuai format",
        "any.required": "Email harus diisi",
      }),

      first_name: Joi.string().min(1).required().messages({
        "any.required": "First name harus diisi",
        "string.empty": "First name harus diisi",
      }),

      last_name: Joi.string().min(1).required().messages({
        "any.required": "Last name harus diisi",
        "string.empty": "Last name harus diisi",
      }),

      password: Joi.string().min(6).required().messages({
        "string.min": "Password minimal 6 karakter",
        "any.required": "Password harus diisi",
      }),
    });

    // Validasi data
    const { error } = schema.validate(userData, { abortEarly: false });

    if (error) {
      // BENAR - throw error, bukan return response
      const validationError = {
        name: "ValidationError",
        msg: error.details.map((detail) => detail.message),
      };
      throw validationError;
    }

    const hashedPassword = await hashPassword(userData.password);

    const query = `
    INSERT INTO
      "Users" (email, first_name, last_name, password)
    VALUES
      ($1, $2, $3, $4)
    RETURNING
      id, email, first_name, last_name
    `;
    const values = [
      userData.email,
      userData.first_name,
      userData.last_name,
      hashedPassword,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }
}

module.exports = UserModel;

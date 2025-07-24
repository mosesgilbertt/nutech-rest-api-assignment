const db = require("../db/connection");
const { hashPassword } = require("../helpers/bcrypt");

class UserModel {
  static async createUser(userData) {
    const errors = {
      name: "ValidationError",
      msg: [],
    };

    if (!userData.email || !userData.email.includes("@")) {
      errors.msg.push("Paramter email tidak sesuai format.");
    }
    if (!userData.first_name) {
      errors.msg.push("First name harus diisi.");
    }
    if (!userData.last_name) {
      errors.msg.push("Last name harus diisi.");
    }

    if (!userData.password || String(userData.password).length < 6) {
      errors.msg.push("Password minimal 6 karakter.");
    }

    if (errors.msg.length > 0) {
      throw errors;
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

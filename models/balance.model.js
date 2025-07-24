const db = require("../db/connection");

class BalanceModel {
  static async getBalance(userId) {
    const query = `
    SELECT
      balance
    FROM
      "Users"
    WHERE
      id = $1
    `;
    const values = [userId];

    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      throw {
        name: "NotFound",
        message: "User not found",
      };
    }

    return result.rows[0].balance;
  }
}

module.exports = BalanceModel;

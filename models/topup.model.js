const db = require("../db/connection");
const Joi = require("joi");

class TopupModel {
  static async create({ amount, userId }) {
    const schema = Joi.object({
      amount: Joi.number().positive().required().messages({
        "number.base":
          "Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
        "number.positive":
          "Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
        "any.required": "Top up amount harus diisi",
      }),
    });

    const { error } = schema.validate({ amount, userId });

    if (error) {
      const validationError = {
        name: "ValidationError",
        msg: error.details.map((detail) => detail.message),
      };
      throw validationError;
    }

    await db.query("BEGIN");

    const topupQuery = `
        INSERT INTO
          "Topups" (top_up_amount, user_id, transaction_type, created_on)
        VALUES 
          ($1, $2, 'TOPUP', NOW())
        RETURNING 
          top_up_amount
      `;
    const topupValues = [amount, userId];
    const topupResult = await db.query(topupQuery, topupValues);

    const updateBalanceQuery = `
    UPDATE
      "Users" 
    SET
      balance = COALESCE(balance, 0) + $1 
    WHERE
      id = $2
    RETURNING
      balance
      `;
    const balanceResult = await db.query(updateBalanceQuery, [amount, userId]);

    await db.query("COMMIT");

    return {
      balance: balanceResult.rows[0].balance,
      top_up_amount: topupResult.rows[0].top_up_amount,
    };
  }
}

module.exports = TopupModel;

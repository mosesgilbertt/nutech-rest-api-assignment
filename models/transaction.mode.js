const db = require("../db/connection");
const Joi = require("joi");

class TransactionModel {
  static async createTransaction({ service_code, userId }) {
    const schema = Joi.object({
      service_code: Joi.string().required().messages({
        "any.required": "Service code harus diisi",
      }),
      userId: Joi.number().positive().required().messages({
        "any.required": "User ID harus diisi",
      }),
    });

    const { error } = schema.validate({ service_code, userId });

    if (error) {
      const validationError = {
        name: "ValidationError",
        msg: error.details.map((detail) => detail.message),
      };
      throw validationError;
    }

    await db.query("BEGIN");

    const serviceQuery = `
    SELECT 
      id, service_name, service_tariff 
    FROM 
      "Services" 
    WHERE 
      service_code = $1
    `;
    const serviceResult = await db.query(serviceQuery, [service_code]);

    if (serviceResult.rows.length === 0) {
      throw {
        name: "BadRequest",
        message: "Service atau Layanan tidak ditemukan",
      };
    }

    const service = serviceResult.rows[0];
    const totalAmount = service.service_tariff;

    const userQuery = `
    SELECT 
      balance 
    FROM 
      "Users" 
    WHERE 
      id = $1
    `;
    const userResult = await db.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      throw {
        name: "BadRequest",
        message: "User tidak ditemukan",
      };
    }

    const userBalance = userResult.rows[0].balance || 0;

    if (userBalance < totalAmount) {
      throw {
        name: "BadRequest",
        message: "Saldo tidak mencukupi",
      };
    }

    const invoiceNumber = this.generateInvoiceNumber();

    const transactionQuery = `
    INSERT INTO 
      "Transactions" (invoice_number, service_code, service_name, transaction_type, total_amount, user_id, created_on)
    VALUES 
      ($1, $2, $3, 'PAYMENT', $4, $5, NOW())
    RETURNING 
      invoice_number, service_code, service_name, transaction_type, total_amount, created_on
    `;
    const transactionValues = [
      invoiceNumber,
      service_code,
      service.service_name,
      totalAmount,
      userId,
    ];
    const transactionResult = await db.query(
      transactionQuery,
      transactionValues
    );

    const updateBalanceQuery = `
    UPDATE 
      "Users" 
    SET 
      balance = balance - $1 
    WHERE 
      id = $2
    `;
    await db.query(updateBalanceQuery, [totalAmount, userId]);

    await db.query("COMMIT");

    return transactionResult.rows[0];
  }

  static generateInvoiceNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

    return `INV${date}${month}${year}-${hours}${minutes}${seconds}${milliseconds}`;
  }
}

module.exports = TransactionModel;

const TransactionModel = require("../models/transaction.mode");

class TransactionController {
  static async createTransaction(req, res, next) {
    try {
      const { service_code } = req.body;
      const userId = req.user.id;

      if (!service_code) {
        throw {
          name: "ValidationError",
          message: "Service code harus diisi",
        };
      }

      const result = await TransactionModel.createTransaction({
        service_code,
        userId,
      });

      res.status(200).json({
        status: 0,
        message: "Transaksi berhasil",
        data: {
          invoice_number: result.invoice_number,
          service_code: result.service_code,
          service_name: result.service_name,
          transaction_type: result.transaction_type,
          total_amount: result.total_amount,
          created_on: result.created_on,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TransactionController;

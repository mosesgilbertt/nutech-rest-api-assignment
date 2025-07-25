const BalanceModel = require("../models/balance.model");

class BalanceController {
  static async getBalance(req, res, next) {
    try {
      const userId = req.user.id;

      const balance = await BalanceModel.getBalance(userId);

      res.status(200).json({
        status: 0,
        message: "Get Balance Berhasil",
        data: {
          balance: balance,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BalanceController;

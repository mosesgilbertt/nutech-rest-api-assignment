const TopupModel = require("../models/topup.model");

class TopupController {
  static async createTopup(req, res, next) {
    try {
      const userId = req.user.id;
      const { top_up_amount } = req.body;

      if (!top_up_amount || top_up_amount <= 0) {
        throw {
          name: "BadRequest",
          message:
            "Paramater amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
        };
      }

      const result = await TopupModel.create({
        amount: top_up_amount,
        userId: userId,
      });

      res.status(200).json({
        status: 0,
        message: "Top Up Balance berhasil",
        data: {
          balance: result.balance,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TopupController;

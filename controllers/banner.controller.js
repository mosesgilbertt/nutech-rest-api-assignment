const BannerModel = require("../models/banner.model");

class BannerController {
  static async getAllBanner(req, res, next) {
    try {
      const banners = await BannerModel.getAllBanners();

      res.status(200).json({
        status: 0,
        message: "Sukses",
        data: banners,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BannerController;

const ServiceModel = require("../models/service.model");

class ServiceController {
  static async getAllServices(req, res, next) {
    try {
      const services = await ServiceModel.getAllServices();

      res.status(200).json({
        status: 0,
        message: "Sukses",
        data: services,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ServiceController;

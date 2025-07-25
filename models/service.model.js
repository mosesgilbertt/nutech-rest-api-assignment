const db = require("../db/connection");

class ServiceModel {
  static async getAllServices() {
    const query = `
    SELECT
      service_code, service_name, service_icon, service_tariff
    FROM
      "Services"
    `;

    const result = await db.query(query);
    if (result.rows.length === 0) {
      throw {
        name: "NotFound",
        message: "Tidak service ditemukan",
      };
    }

    return result.rows;
  }
}

module.exports = ServiceModel;

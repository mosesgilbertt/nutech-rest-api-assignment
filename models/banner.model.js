const db = require("../db/connection");

class BannerModel {
  static async getAllBanners() {
    const query = `    
    SELECT
      banner_name, banner_image, description
    FROM
      "Banners"
    ORDER BY
      banner_name ASC
    `;

    const result = await db.query(query);
    if (result.rows.length === 0) {
      throw {
        name: "NotFound",
        message: "No banners found",
      };
    }

    return result.rows;
  }
}

module.exports = BannerModel;

const fs = require("fs");
const pool = require("./connection");

async function seeding() {
  try {
    const banners = JSON.parse(fs.readFileSync("./data/banners.json", "utf-8"));

    const bannersMapped = banners.map((banner) => {
      return `('${banner.banner_name}', '${banner.banner_image}', '${banner.description}')`;
    });

    const bannersMappedJoin = bannersMapped.join(",\n");

    const bannersSeed = `
    INSERT INTO 
      "Banners" (banner_name, banner_image, description)
    VALUES
      ${bannersMappedJoin}
    `;

    const services = JSON.parse(
      fs.readFileSync("./data/services.json", "utf-8")
    );

    const servicesMapped = services.map((service) => {
      return `('${service.service_code}', '${service.service_name}', '${service.service_icon}', ${service.service_tariff})`;
    });

    const servicesMappedJoin = servicesMapped.join(",\n");

    const servicesSeed = `
    INSERT INTO 
      "Services" (service_code, service_name, service_icon, service_tariff)
    VALUES
      ${servicesMappedJoin}
    `;

    await pool.query(bannersSeed);
    await pool.query(servicesSeed);

    console.log("Data seeded successfully");
  } catch (error) {
    console.log(error);
  }
}

seeding();

async function migrating() {
  try {
    const dropTable = `DROP TABLE IF EXISTS "Users", "Banners", "Services", "Topups", "Transactions";`;

    const tableUsers = `
    CREATE TABLE IF NOT EXISTS "Users" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    );
    `;

    const tableBanners = `
    CREATE TABLE IF NOT EXISTS "Banners" (
    id SERIAL PRIMARY KEY,
    banner_name VARCHAR(255) NOT NULL,
    banner_image VARCHAR(255) NOT NULL,
    description TEXT,
    );
    `;

    const tableServices = `
    CREATE TABLE IF NOT EXISTS "Services" (
    id SERIAL PRIMARY KEY,
    service_code VARCHAR(255) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    service_icon VARCHAR(255) NOT NULL,
    service_tarif INTEGER NOT NULL,
    );
    `;

    await pool.query(dropTable);

    await pool.query(tableUsers);

    await pool.query(tableBanners);

    await pool.query(tableServices);

    console.log("Tables created successfully");
  } catch (error) {
    console.log(error);
  }
}

migrating();

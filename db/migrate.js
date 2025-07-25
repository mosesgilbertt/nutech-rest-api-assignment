const db = require("./connection");

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
    balance INTEGER DEFAULT 0
    );
    `;

    const tableBanners = `
    CREATE TABLE IF NOT EXISTS "Banners" (
    id SERIAL PRIMARY KEY,
    banner_name VARCHAR(255) NOT NULL,
    banner_image VARCHAR(255) NOT NULL,
    description TEXT
    );
    `;

    const tableServices = `
    CREATE TABLE IF NOT EXISTS "Services" (
    id SERIAL PRIMARY KEY,
    service_code VARCHAR(255) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    service_icon VARCHAR(255) NOT NULL,
    service_tariff INTEGER NOT NULL
    );
    `;

    const tableTopups = `
    CREATE TABLE IF NOT EXISTS "Topups" (
    id SERIAL PRIMARY KEY,
    top_up_amount INTEGER NOT NULL,
    user_id INTEGER NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL,
    created_on TIMESTAMP DEFAULT NOW()
    );
    `;

    await db.query(dropTable);

    await db.query(tableUsers);

    await db.query(tableBanners);

    await db.query(tableServices);

    await db.query(tableTopups);

    console.log("Tables created successfully");
  } catch (error) {
    console.log(error);
  }
}

migrating();

require("dotenv").config();

const pg = require("pg");
const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD.toString(),
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  idleTimeoutMillis: 500,
});

module.exports = pool;

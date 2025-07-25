if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const db = require("./db/connection");
const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const { Client } = require("pg");
const app = express();

const client = new Client({
  connectionString: process.env.SUPABASE_DB_URL,
});

client
  .connect()
  .then(() => {
    console.log("Connected to Supabase PostgreSQL");
  })
  .catch((err) => {
    console.error("Supabase PostgreSQL connection error:", err.stack);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", require("./routes/index"));
app.use(errorHandler);

module.exports = app;

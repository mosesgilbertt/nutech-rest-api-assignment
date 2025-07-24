if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(router);
// app.use(errorHandler);
console.log(process.env);

module.exports = app;

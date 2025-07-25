const TransactionController = require("../controllers/transaction.controller");
const authentication = require("../middlewares/authentication");

const transaction = require("express").Router();

transaction.post("/", authentication, TransactionController.createTransaction);

module.exports = transaction;

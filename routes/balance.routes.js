const BalanceController = require("../controllers/balance.controller");
const authentication = require("../middlewares/authentication");

const balance = require("express").Router();

balance.get("/", authentication, BalanceController.getBalance);

module.exports = balance;

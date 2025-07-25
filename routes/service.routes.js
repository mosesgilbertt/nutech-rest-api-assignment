const ServiceController = require("../controllers/service.controller");
const authentication = require("../middlewares/authentication");

const service = require("express").Router();

service.get("/", authentication, ServiceController.getAllServices);

module.exports = service;

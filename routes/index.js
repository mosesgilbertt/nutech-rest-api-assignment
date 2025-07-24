const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "nutech API",
  });
});

router.use(require("./user.routes"));
router.use("/banner", require("./banner.routes"));
router.use("/service", require("./service.routes"));

module.exports = router;

const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "nutech API",
  });
});

router.use(require("./user.routes"));
router.use("/banner", require("./banner.routes"));
router.use("/service", require("./service.routes"));
router.use("/balance", require("./balance.routes"));
router.use("/topup", require("./topup.routes"));
router.use("/transaction", require("./transaction.routes"));

module.exports = router;

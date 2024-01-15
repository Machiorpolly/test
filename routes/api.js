const express = require("express");
const controller = require("../controllers/Controller");
const router = express.Router();

router.post("/signup", controller.upload, controller.signup);
router.get("/hospital/:id", controller.getRecords);

module.exports = router;

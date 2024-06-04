const express = require("express");
const router = express.Router();
const utilities = require("../utilities/");
const testDriveController = require("../controllers/testDriveController");

router.get("/register", utilities.handleErrors(testDriveController.testDrive));

router.post("/register", utilities.handleErrors(testDriveController.registerTestDrive));

module.exports = router;
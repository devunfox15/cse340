const express = require("express");
const router = express.Router();
const utilities = require("../utilities/");
const testDriveController = require("../controllers/testDriveController");
// middlw ware here to make sure only people logged in can access so no spam happens
const checkLogin = require("../middleware/checkLogin");
const checkAdminOrEmployee = require("../middleware/jwtHandler");

router.get("/register", checkLogin, utilities.handleErrors(testDriveController.testDrive));

router.post("/register",checkLogin, utilities.handleErrors(testDriveController.registerTestDrive));

router.get("/dashboard", checkAdminOrEmployee, utilities.handleErrors(testDriveController.testDriveDashboard));

router.post("/booked/:id", checkAdminOrEmployee, utilities.handleErrors(async (req, res, next) => {
    await testDriveController.updateTestDriveStatus(req, res, next, "booked");
}));

router.post("/spam/:id", checkAdminOrEmployee, utilities.handleErrors(async (req, res, next) => {
    await testDriveController.updateTestDriveStatus(req, res, next, "spam");
}));
module.exports = router;
// Needed Resources
const regValidate = require('../utilities/account-validation')
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");

// Route to build the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to handle registration form submission
// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )
module.exports = router;

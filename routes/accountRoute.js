// Needed Resources
const Validate = require('../utilities/account-validation')
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const checkLogin = require("../middleware/checkLogin");

/* ****************************************
 *  account management view
 * ************************************ */
router.get("/", checkLogin, utilities.handleErrors(accountController.buildManagement));

// Route to build the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to update account information
router.get("/update/:id", checkLogin, utilities.handleErrors(accountController.updateAccountView));

// Process the update account data
router.post("/update", 
  Validate.updateAccountRules(), 
  checkLogin, 
  Validate.checkUpdateAccountData, 
  utilities.handleErrors(accountController.updateAccount));

// Route to change password
router.post("/change-password",
Validate.changePasswordRules(),
checkLogin, 
Validate.checkChangePasswordData,
utilities.handleErrors(accountController.changePassword));

// Route to handle registration form submission
// Process the registration data
router.post(
    "/register",
    Validate.registationRules(),
    Validate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login attempt
// Process the login request
router.post(
  "/login",
  Validate.loginRules(),
  Validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

module.exports = router;

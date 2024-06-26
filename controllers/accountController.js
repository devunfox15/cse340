// Required utilities and models
const bcrypt = require("bcryptjs")
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const { validationResult } = require("express-validator");

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    notice: req.flash('notice')
  });
}
/* ****************************************
*  Deliver login view
* *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav();
  const accountData = await accountModel.getAccountById(req.user.account_id);
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    user: accountData,
    errors: null,
    messages: req.flash("notice"),
  });
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
  })
  return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
    if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
    req.session.user = accountData;
    return res.redirect("/account/")
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
}

async function accountLogout(req, res) {
  req.flash('notice', 'You have successfully logged out.');
  res.clearCookie('sessionId');
  res.clearCookie('jwt');
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/');
    }
    res.redirect('/');
  });
}
/* ****************************************
 *  Update account view
 * ************************************ */
async function updateAccountView(req, res, next) {
  let nav = await utilities.getNav();
  const accountId = req.params.id;
  const accountData = await accountModel.getAccountById(accountId);
  res.render("account/update-account", {
    title: "Update Account Information",
    nav,
    user: accountData,
    errors: null,
    messages: req.flash('notice')
  });
}

/* ****************************************
 *  Update account information
 * ************************************ */
async function updateAccount(req, res, next) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body;
  
  const updateResult = await accountModel.updateAccountById(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );

  if (updateResult) {
    req.flash("notice", "Account information updated successfully.");
  } else {
    req.flash("notice", "Error updating account information.");
  }

  res.redirect(`/account/update/${account_id}`);
}

async function changePassword(req, res, next) {
  const { account_id, account_password } = req.body;
  const hashedPassword = await bcrypt.hash(account_password, 10);

  const updateResult = await accountModel.updatePasswordById(account_id, hashedPassword);

  if (updateResult) {
    req.flash("notice", "Password updated successfully.");
  } else {
    req.flash("notice", "Error updating password.");
  }

  res.redirect(`/account/update/${account_id}`);
}

async function getAccountByEmail(email) {
  return await accountModel.getAccountByEmail(email);
}

// Export the functions
module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, accountLogout, updateAccountView, updateAccount, changePassword, getAccountByEmail };
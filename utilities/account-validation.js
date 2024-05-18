const accountModel = require("../models/account-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
  

  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }


  /*  **********************************
  *  login Data Validation Rules
  * ********************************* */
  validate.loginRules = () => {
    return [
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (!emailExists){
          throw new Error("Email does not exist. Please register or try again.")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

/* **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // classification_name is required and must be alpha
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .isAlpha()
      .withMessage("Classification name cannot contain spaces or special characters."),
  ]
}

/* ******************************
 * Check classification data and return errors or continue
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/* ******************************
 * Check inventory rules
 * ***************************** */
validate.inventoryRules = () => {
  return [
    body('inv_make')
      .trim()
      .escape()
      .isAlpha()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Make cannot contain special characters or numbers.'),
    body('inv_model')
      .trim()
      .escape()
      .matches(/^[A-Za-z\d]+$/)
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Model cannot contain special characters.'),
    body('inv_year')
      .isInt({ min: 1700, max: 2099 })
      .withMessage('Year must be a 4-digit number between 1700 and 2099.')
      .notEmpty()
      .withMessage('Year is required.'),
    body('inv_description')
      .trim()
      .isLength({ min: 10 })
      .withMessage('Description must be at least 10 characters.')
      .notEmpty()
      .withMessage('Description is required.'),
    body('inv_image')
      .trim()
      .matches(/^\/images\/vehicles\/[a-zA-Z0-9-_]+\.(png|jpg|jpeg|gif)$/)
      .withMessage('Image must be a valid URL.')
      .notEmpty()
      .withMessage('Image is required.'),
    body('inv_thumbnail')
      .trim()
      .matches(/^\/images\/vehicles\/[a-zA-Z0-9-_]+\.(png|jpg|jpeg|gif)$/)
      .withMessage('Thumbnail must be a valid URL.')
      .notEmpty()
      .withMessage('Thumbnail is required.'),
    body('inv_price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number.')
      .notEmpty()
      .withMessage('Price is required.'),
    body('inv_miles')
      .isInt({ min: 0, max: 9999999 })
      .withMessage('Miles must be a number between 0 and 9999999.')
      .notEmpty()
      .withMessage('Miles is required.'),
    body('inv_color')
      .trim()
      .isAlpha()
      .withMessage('Color must be alphabetic.')
      .notEmpty()
      .withMessage('Color is required.'),
    body('classification_id')
      .isInt({ min: 1 })
      .withMessage('Classification ID must be a number greater than 0.')
      .notEmpty()
      .withMessage('Classification ID is required.'),
  ];
};



/* ******************************
 * Checks inventory data and return errors or continue
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(classification_id);
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Inventory",
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });
    return;
  }
  next();
};

  
  module.exports = validate
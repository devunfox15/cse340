const accountModel = require("../models/test-drive-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator");
const validate = {}

/* **********************************
 * Test Drive Registration Validation Rules
 * ********************************* */
validate.testDriveRegistrationRules = () => {
    return [
        body("firstName")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a first name."),
        body("lastName")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a last name."),
        body("email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (email) => {
                const emailCount = await testDriveModel.countCustomerTestDrives({ email });
                if (emailCount >= 1) {
                    throw new Error("Email exists. You have already registered for a test drive.");
                }
            }),
        body("phone")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("A phone number is required.")
            .custom(async (phone) => {
                const phoneCount = await testDriveModel.countCustomerTestDrives({ phone });
                if (phoneCount >= 1) {
                    throw new Error("Phone number exists. You have already registered for a test drive.");
                }
            }),
        body("age")
            .isInt({ min: 18, max: 80 })
            .withMessage("Age must be between 18 and 80."),
        body("licenseState")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2, max: 2 })
            .withMessage("Please provide a valid 2-letter state abbreviation."),
        body("licenseNumber")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a valid license number."),
    
    ];
};

/* ******************************
 * Check Test Drive Data and return errors or continue
 * ***************************** */
validate.checkTestDriveData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("test-drive/register", {
            errors: errors.array(),
            title: "Register for Test Drive",
            nav,
            ...req.body,
        });
        return;
    }
    next();
};

module.exports = validate;
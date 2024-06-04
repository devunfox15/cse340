const utilities = require("../utilities/");
const pool = require('../database/'); // Ensure you have your database pool connection here
const { countCustomerTestDrives } = require('../models/test-drive-model');

/* ****************************************
*  Deliver test drive view
* *************************************** */
async function testDrive(req, res, next) {
    let nav = await utilities.getNav();
    const { make, model, year } = req.query;
    res.render("test-drive/register", {
        title: "Test Drive Booker",
        nav,
        errors: null,
        make,
        model,
        year,
        firstName: req.query.firstName || '',
        lastName: req.query.lastName || '',
        email: req.query.email || '',
        phone: req.query.phone || '',
        issDate: req.query.issDate || '',
        expDate: req.query.expDate || ''
    });
}

/* ****************************************
*  Handle test drive registration
* *************************************** */
async function registerTestDrive(req, res, next) {
    const { make, model, year, firstName, lastName, email, phone, issDate, expDate } = req.body;

    try {
        // Check the number of test drives for this customer
        const testDriveCount = await countCustomerTestDrives(email);

        if (testDriveCount >= 3) {
            req.flash('Duplication', 'You have already registered for the maximum of 3 test drives requests.');
            return res.redirect('/');
        }

        const sql = `INSERT INTO test_drives (make, model, year, first_name, last_name, email, phone, iss_date, exp_date)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`;
        const params = [make, model, year, firstName, lastName, email, phone, issDate, expDate];
        await pool.query(sql, params);

        req.flash('success', 'Test drive registered successfully!');
        res.redirect('/test-drive/register');
    } catch (error) {
        console.error('Error registering test drive:', error);
        req.flash('error', 'There was an error registering the test drive. Please try again.');
        res.redirect('/test-drive/register');
    }
}

module.exports = { testDrive, registerTestDrive };
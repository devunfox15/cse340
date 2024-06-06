const utilities = require("../utilities/");
const pool = require('../database/'); // Ensure you have your database pool connection here
const { countCustomerTestDrives, tdPhone, getTestDriveRequests } = require('../models/test-drive-model');

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
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        email: req.query.email,
        phone: req.query.phone,
        age: req.query.age,
        licenseState: req.query.licenseState,
        licenseNumber: req.query.licenseNumber,
        issDate: req.query.issDate,
        expDate: req.query.expDate
    });
}

/* ****************************************
*  Handle test drive registration
* *************************************** */
async function registerTestDrive(req, res, next) {
    const { make, model, year, firstName, lastName, email, phone, age, licenseState, licenseNumber, issDate, expDate } = req.body;

    try {
        // Check the number of test drives for this customer
        const testDriveCount = await countCustomerTestDrives(email);
        const phonecount = await tdPhone(phone);

        if (phonecount >= 1) {
            req.flash('Duplication', 'You have already registered for the maximum of 1 test drive request. We will reach out to you as soon as we can!');
            return res.redirect('/');
        }

        if (testDriveCount >= 1) {
            req.flash('Duplication', 'You have already registered for the maximum of 1 test drive request. We will reach out to you as soon as we can!');
            return res.redirect('/');
        }

        const sql = `INSERT INTO test_drives (make, model, year, first_name, last_name, email, phone, age, license_state, license_number, iss_date, exp_date)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`;
        const params = [make, model, year, firstName, lastName, email, phone, age, licenseState, licenseNumber, issDate, expDate];
        await pool.query(sql, params);

        req.flash('success', 'Test drive registered successfully! You will be contacted as soon as we can.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering test drive:', error);
        req.flash('error', 'There was an error registering the test drive. Please try again.');
        res.redirect('/test-drive/register');
    }
}

async function testDriveDashboard(req, res, next) {
    try {
        let nav = await utilities.getNav();
        let request = await getTestDriveRequests();
        let testDrives = request;

        res.render("test-drive/dashboard", {
            title: "Test Drive Dashboard",
            nav,
            testDrives,
            errors: null,
        });
    } catch (error) {
        console.error('Error fetching test drives:', error);
        res.render("test-drive/dashboard", {
            title: "Test Drive Dashboard",
            nav,
            testDrives: [],
            errors: [{ msg: 'Error fetching test drives. Please try again later.' }],
        });
    }
}
async function updateTestDriveStatus(req, res, next) {
    const { id } = req.params;
    const status = req.path.includes("booked") ? "booked" : "spam";
    try {
        const sql = `UPDATE test_drives SET test_drive_status = $1 WHERE id = $2`;
        const params = [status, id];
        await pool.query(sql, params);

        req.flash('success', `Test drive status updated to ${status}.`);
        res.redirect('/test-drive/dashboard');
    } catch (error) {
        console.error(`Error updating test drive status to ${status}:`, error);
        req.flash('error', 'There was an error updating the test drive status. Please try again.');
        res.redirect('/test-drive/dashboard');
    }
}

module.exports = { testDrive, registerTestDrive, testDriveDashboard, updateTestDriveStatus };


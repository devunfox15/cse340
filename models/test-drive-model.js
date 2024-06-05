const pool = require("../database/")

async function vehicleExists(make, model, year) {
    const sql = `SELECT * FROM public.inventory WHERE make = $1 AND model = $2 AND year = $3`;
    const params = [make, model, year];
    const result = await pool.query(sql, params);
    return result.rowCount > 0;
    }

    async function countCustomerTestDrives(email) {
        const sql = `SELECT COUNT(*) FROM test_drives WHERE email = $1`;
        const params = [email];
        const result = await pool.query(sql, params);
        return parseInt(result.rows[0].count, 10);
    }
    async function tdPhone(phone) {
        const sql = `SELECT COUNT(*) FROM test_drives WHERE phone = $1`;
        const params = [phone];
        const result = await pool.query(sql, params);
        return parseInt(result.rows[0].count, 10);
    }
    async function tdName(first_name, last_name) {
        const sql = `SELECT COUNT(*) FROM test_drives WHERE first_name = $1 AND last_name = $2`;
        const params = [first_name , last_name];
        const result = await pool.query(sql, params);
        return parseInt(result.rows[0].count, 10);
    }

    module.exports = { vehicleExists, countCustomerTestDrives, tdPhone, tdName };
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

    module.exports = { vehicleExists, countCustomerTestDrives }
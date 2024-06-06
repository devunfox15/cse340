const pool = require("../database/")

async function getTestDriveRequests() {
    const sql = `SELECT * FROM test_drives WHERE test_drive_status = 'unanswered'`;
    const result = await pool.query(sql);
    return result.rows.map(row => {
        row.iss_date = formatDate(row.iss_date);
        row.exp_date = formatDate(row.exp_date);
        return row;
    });
}; 
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

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

    module.exports = { getTestDriveRequests, vehicleExists, countCustomerTestDrives, tdPhone };
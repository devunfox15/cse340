const jwt = require('jsonwebtoken');

function checkAdminOrEmployee(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
    req.flash('notice', 'You must be logged in to access this area.');
    return res.redirect('/account/login');
    }

jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
        req.flash('notice', 'Invalid token. Please log in again.');
        return res.redirect('/account/login');
    }
    if (user && (user.account_type === 'employee' || user.account_type === 'admin')) {
        req.user = user;
        next();
    } else {
        req.flash('notice', 'You do not have permission to access this area.');
        return res.redirect('/account/login');
    }
    });
}

module.exports = checkAdminOrEmployee;
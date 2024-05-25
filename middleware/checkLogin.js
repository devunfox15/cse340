const jwt = require('jsonwebtoken');

function checkLogin(req, res, next) {
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
    req.user = user;
    next();
  });
}

module.exports = checkLogin;
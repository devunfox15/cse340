module.exports = (err, req, res, next) => {
    if (err.status === 500) {
      res.status(500).render('error', { message: 'Something went wrong!' });
    } else {
      next(err);
    }
  };
exports.triggerError = (req, res, next) => {
    // Intentionally throw an error
    const error = new Error('Intentional Error');
    error.status = 500;
    next(error);
  }; 
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { metadata: err });
  res.status(500).json({ error: 'Server error' });
};

module.exports = errorHandler;

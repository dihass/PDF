const jwt = require('jsonwebtoken');
const logger = require('../utils/logger'); 

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');
  logger.info(`Authorization header: ${authHeader}`); // Log the authorization header

  if (!authHeader) {
    logger.error('No token, authorization denied');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    logger.info(`Extracted token: ${token}`); // Log the extracted token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    logger.error('Token is not valid', { metadata: err });
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

const winston = require('winston');
const morgan = require('morgan');

// log levels, mess with this
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5,
};

// logger configuration
const logger = winston.createLogger({
  levels: logLevels,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' }),
  ],
});

// Add a stream property to the logger
logger.stream = {
  write: function (message) {
    // Use the logger.info method so that morgan logs will be captured
    logger.info(message.trim());
  },
};

module.exports = logger;
const winston = require('winston');
require('winston-daily-rotate-file');
const { combine, timestamp, colorize, align, printf } = winston.format;

const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: './errorLogger/logs/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '7d',
  level: 'error',
  format: combine(
    printf((info) => `[${info.timestamp}] - ${info.message}`)
  )
});

exports.winstonLogger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss A',
    }),
    align(),
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize({all: true}),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
      )
    }),
    fileRotateTransport,
  ],
});

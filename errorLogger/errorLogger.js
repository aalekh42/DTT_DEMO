const { winstonLogger } = require("./winstonLogger");

exports.errorHandler = (err, req, res, next) => {
  if(err.status) res.status(err.status);
  else res.status(500);
  winstonLogger.error(err.message);
  res.json({status: 'error', msg: err.message});
}
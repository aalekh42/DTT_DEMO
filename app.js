const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const router = require('./routes/router');
const { authentication } = require('./controllers/auth');
const { winstonLogger } = require('./errorLogger/winstonLogger');
const { errorHandler } = require('./errorLogger/errorLogger');
global.__basedir = __dirname;

const app = express();

//for security policy
app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
  );
  next();
});

app.use(helmet());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(mongoSanitize());
app.use(authentication);
app.use(express.static(path.join(__dirname, 'client','build')));
app.use('/', router);
app.use(errorHandler);

require('dotenv').config();
require('./config/mongo');
const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>winstonLogger.info(`Server started at port ${PORT}...`));
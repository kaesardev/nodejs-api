require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');

//Starting Database
require('./middlewares/mongoose');

//Starting Auth Middlewares
const passportApp = require('./middlewares/passport-app');
const passportUsr = require('./middlewares/passport-usr');

//Starting App
const app = express();

//View Engine set
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);

//Starting Middlewares
app.use(cors());
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passportApp.initialize());
app.use(passportUsr.initialize());
app.use(passportApp.session());
app.use(passportUsr.session());

//Starting routes
const routes = require('./routes');
app.use('/', routes);

//Server listening
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

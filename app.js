const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongooseConnection = require('./lib/mongooseConn');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
require('dotenv').config();
const passport = require('passport');

const sessionStore = new MongoStore({mongooseConnection: mongooseConnection, collection: 'sessions'});

var app = express();

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
      maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
  }
}));

require('./lib/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next) => {
  //console.log(req.session);
  //console.log(req.user);
  next();
})

app.use((req,res,next) => {
  res.locals.req = req;
  res.locals.res = res;
  next();
})
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

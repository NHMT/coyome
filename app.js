var createError = require('http-errors');
var flash = require('connect-flash');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Passport = require('passport');
var session = require('express-session');




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userRouter = require('./routes/user');

var app = express();


//Connect PostgreSQL
const { Pool, Client } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Coyome',
  password: 'minhtri',
  port: 5432,
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'mysecret',
  saveUninitialized: true,
  resave: true,
}));
app.use(Passport.initialize());
app.use(Passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());


var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3500);

app.use(function(req, res, next){
  res.locals.user = req.user;
  res.locals.success_messages = req.flash('success');
  res.locals.no_user_messages = req.flash('no_user');
  res.locals.err_user_messages = req.flash('no_user');
  res.locals.chua_dn_messages = req.flash('chua_dn');
  res.locals.sign_out = req.flash('sign_out');
  
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.user = req.user;
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var assessmentRouter = require('./routes/assessment');

const e = require('express');
const session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));

// Keep up a temporary session with user (non-persistent)
app.use(session({
  secret: 'html565e232ed43477b2f5r1r463r1f86f14386tr4365tr143q65fcb4413023548fcehtml5',
  resave: false,
  saveUninitialized: false,
  maxAge: 60*60*2*1000
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use('/load', assessmentRouter);



/* Catches ALL POST requests. Currently, only POST requests are the logins and bio updates. 
Furthermore, it also catches on which page it happened */
app.post('*', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // Custom error handler (custom flash message system)
  res.locals.user = req.session.user
  res.locals.msgs = req.session.messages || [];
  res.locals.msgs.push(['error', 'Error ' + err.status + ' ' + err.message]);
  
  // verbose error page (too verbose for production, please comment out for end product)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.locals.title = "Error " + err.status;
  //res.render('error');
  res.redirect('back');
});


module.exports = app;

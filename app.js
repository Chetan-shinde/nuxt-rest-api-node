require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const checkAuthorization = require('./middleware/authorization.js');



const initRouter = require('./routes/init');
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
//var usersRouter = require('./routes/users.mjs');
var productRouter = require('./routes/product');
var mqsRouter = require('./routes/mqs');
var streamRouter = require('./routes/stream');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var corsOptions = {
  origin: 'http://localhost:4000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(checkAuthorization.checkAuthorization);
app.use('/', indexRouter);
/*import('./routes/users.mjs').then(function(usersRouter){
  app.use('/users', function(req,res,next){
    res.send("hi");
  });
});*/


app.use('/init', initRouter);
app.use('/login', loginRouter);
app.use('/products', productRouter);
app.use('/mqs', mqsRouter);
app.use('/stream', streamRouter);


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

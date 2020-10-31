const createError = require('http-errors');
const express = require('express');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const log4js = require("log4js");
const path = require('path');
//const fs=require('fs');

var app = express();
var Router = require('./router')(app);

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
//使用bodyparser解析post
app.use(bodyparser.json()); 
app.use(bodyparser.urlencoded({ extended: true }));
//日志输出
log4js.configure({
    appenders: {accesslog: { type: 'dateFile', filename: 'log/access.log' }},
    categories: {default: { appenders: [ 'accesslog' ], level: 'debug' }}
});
app.use(log4js.connectLogger(log4js.getLogger('Access History')));
//express init
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
//路由
app.use('/', Router);


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
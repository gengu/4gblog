var express = require('express');
var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var settings  = require('./settings');
var  mult=require('connect-multiparty'); 



//控制器
var routes = require('./controller/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cookieParser());


app.use(session({
    secret: 'genxiaogu',
    store: new MongoStore({
      db : settings.db,

    })
  }));


app.use(express.static(path.join(__dirname, 'public')));

//路由 每个页面请求的指向
app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
   res.render('404', { title: '404' });
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        resave:true;
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

require('dotenv').load()

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var routes = require('./routes/index').default;
var channels = require('./routes/channels').default;
var themes = require('./routes/themes').default;
var timeSettings = require('./routes/timeSettings').default;

var teams = require('./routes/admin/teams').default;
var surveys = require('./routes/admin/surveys').default;
var questions = require('./routes/admin/questions').default;
var answers = require('./routes/admin/answers').default;
var results = require('./routes/admin/results').default;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(session({
  store: new RedisStore({ url: process.env.REDIS_URL }),
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  name: 'mentor-slack-integration',
  resave: true,
  saveUninitialized: true
}));

// routes
app.use('/', routes);
app.use('/channels', channels);
app.use('/themes', themes);
app.use('/time_settings', timeSettings);
app.use('/admin/teams', teams);
app.use('/admin/surveys', surveys);
app.use('/admin', questions);
app.use('/admin', answers);
app.use('/admin', results);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
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

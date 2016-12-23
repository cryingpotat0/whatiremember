var config = require('./config');
var express = require('express');
var morgan = require('morgan');
var compress = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');

module.exports = function() {
  var app = express();
  
  // App plugins
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else if (process.env.NODE_ENV === 'production') {
    app.use(compress());
  }

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());
  app.use(methodOverride());

  app.use(session({
    saveUnitialized: true,
    resave: true,
    secret: config.sessionSecret
  }));

  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  //Views
  app.set('views', './app/views');
  app.set('view engine', 'ejs');

  //Routes
  require('../app/routes/users.server.routes.js')(app);
  require('../app/routes/index.server.routes.js')(app);
  app.use(express.static('./public'));

  return app;
}

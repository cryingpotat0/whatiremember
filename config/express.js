var express = require('express');
var config = require('./config');
var session = require('express-session');
var passport = require('passport');
var bodyParser = require('body-parser');
var flash = require('connect-flash');

module.exports = function() {
  var app = express();
  
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());
  app.use(session({secret: "nothing",
                    resave: true,
                    saveUninitialized: true}));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  
  app.set('views', './app/views');
  app.set('view engine', 'ejs');

  require('../app/routes/users.routes.js')(app);
  app.use(express.static('./public'));

  return app;
}

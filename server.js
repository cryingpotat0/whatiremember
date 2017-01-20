process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var mongoose = require('./config/mongoose');
var passport = require('./config/passport');
var express = require('./config/express');

var db = mongoose();
var app = express();
var passport = passport();

app.listen(3000);
module.exports = app;



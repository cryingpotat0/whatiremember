var mongoose = require('mongoose');
var config = require('./config');

module.exports = function() {
  var db = mongoose.connect(config.db);
  
  //Insert any other models
  require('../app/models/user.server.model');

  return db
}

var passport = require('passport');
var mongoose = require('mongoose');

module.exports = function() {
  var User = mongoose.model('User');
  
  //TODO Understand This
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  //TODO Understand This
  passport.deserializeUser(function(id, done) {
    User.findOne({
      _id: id
    }, '-password -salt', function(err, user) {
      done(err, user);
    });
  });

  require('./strategies/local.js')();
};

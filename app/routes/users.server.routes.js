var users = require('../../app/controllers/users.server.controller');
var passport = require('passport');

module.exports = function(app) {

  //local
  app.route('/signup')
    .get(users.renderSignup)
    .post(users.signup);

  app.route('/signin')
    .get(users.renderSignin)
    .post(passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/signin',
      failureFlash: true
    }));
  app.get('/signout', users.signout);
  app.get('/users', users.list);

  //facebook
  app.get('/oauth/facebook', passport.authenticate('facebook', {
    scope : 'email',
    failureRedirect: '/signin'
  }));
  app.get('/oauth/facebook/callback', passport.authenticate('facebook',
    {
      scope : 'email',
      failureRedirect: '/signin',
      successRedirect: '/'
    }));
};

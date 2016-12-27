var users = require('../controllers/users.server.controller.js');
var passport = require('passport');
module.exports = function(app) {

  app.get('/', users.home);
  app.post('/api/signup', users.signup);
  app.post('/api/login', passport.authenticate('local'), function(req, res) {
      //console.log("User successfully logged in");
      res.json({ message: "Success",
                _id: req.user.id,
            });

        });
  app.post('/api/logout', users.logout);
}

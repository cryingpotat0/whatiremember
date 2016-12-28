var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.home = function(req, res) {
  res.render('index', { 
    user: req.user
     });
};


module.exports.logout = function(req, res, next) {
  if(!(req.user)){
    res.status(401).send({error: "No user logged in"});
  } else {
    req.logout();
    res.json({message: "Success"});
  }
}

module.exports.signup = function(req, res, next) {
  if(req.user) {
    res.status(422).send({error: "User already signed in"});
  } else {
    var user = new User(req.body);
    //console.log(req.body);
    user.provider = 'local';
    user.save(function(err){
      if(err) {
        //console.log(err);
        res.status(422).send({error: err});
        //res.json({message: err});
      }
      else {
      req.login(user, function(err) {
        if(err) {
          res.status(401).send({error: err});
        } else {
          res.json({message: "Successful login"});
        }
      });
      }
    });
  }
};

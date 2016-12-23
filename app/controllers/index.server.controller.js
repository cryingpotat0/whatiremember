exports.render = function(req, res){
  if (req.session.lastVisit) {
    console.log('Session Success');
    console.log(req.session.lastVisit);
  }

  //req.session is populated by express-session
  req.session.lastVisit = new Date();

  res.render('index', { title: 'Hello World' } );
};

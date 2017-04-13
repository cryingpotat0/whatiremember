var notebooks = require('../controllers/notebook.server.controller.js');

module.exports = function(app) {
  app.post('/api/notebook', authenticateUser, notebooks.create);
  app.get('/api/notebook', authenticateUser, notebooks.list);

  app.get('/api/notebook/:notebookId', notebooks.findOne, currentUserAccess, notebooks.listOne);
  app.delete('/api/notebook/:notebookId', notebooks.findOne, adminCheck, currentUserAccess, notebooks.delete);
  app.patch('/api/notebook/:notebookId', notebooks.findOne, currentUserAccess, notebooks.update);
}

var authenticateUser = function(req, res, next) {
  if(!(req.user)){
    res.status(401).send({error: "User not signed in"});
  } else {
    next();
  }
}

var currentUserAccess = function(req, res, next) {
  if(!(req.notebook)) {
    res.status(401).send({error: "This book does not exist"});
  }
  if(!(req.user) || (req.user.id != req.notebook.creatorId)){
    res.status(401).send({error: "You are not permitted access to this notebook"});
  } else {
    next();
  }
}

var mongoose = require('mongoose');
var Notebook = mongoose.model('Notebook');

module.exports.create = function(req, res, next) {
  var notebook = new Notebook(req.body);
  notebook.creator = req.user.id;
  notebook.creatorId = req.user.id;
  notebook.save(function(err) {
    if(err) {
      res.status(422).send({error: err});
    } else {
      res.json({message: "Success"});
    }

  });
}

module.exports.findOne = function(req, res, next) {
  Notebook.findOne({_id: req.params.notebookId}, function(err, notebook) {
    if(err) {
      res.status(404).send({error: err})
    } else {
      req.notebook = notebook;
      next();
    }
  });
} 

module.exports.list = function(req, res, next){
  Notebook.find({creatorId: req.user.id}, function(err, notebooks) {
    if(err) {
      res.status(404).send({error: err});
    } else {
      res.json(notebooks);
    }
  });
}

module.exports.delete = function(req, res, next) {
  var notebook = req.notebook;
  notebook.remove(function(err) {
    if(err) {
      res.status(400).send({error: err});
    } else {
      res.json({message: "Success", notebook: notebook});
    }
  });
}

module.exports.update = function(req, res, next) {
  var notebook = req.notebook;
  notebook.title = req.body.title;
  notebook.lines = req.body.lines;
  notebook.save( function(err) {
    if(err) {
      res.status(400).send({error: err});
    } else {
      res.json({message: "Success", notebook: notebook});
    }
  });
}

module.exports.listOne = function(req, res, next) {
  if(req.notebook) {
    res.json({notebook: req.notebook});
  } else {
    res.status(404).send({error: "Invalid request"});
  }
}


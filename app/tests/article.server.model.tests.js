var app = require('../../server.js'),
    should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Notebook = mongoose.model('Notebook');

var user, notebook;

describe('Article model unit tests:', function() {
  beforeEach(function(done) { 
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });
    user.save(function() {
      notebook = new Notebook({
        title: 'Title',
        lines: [],
        creator_id: user.id,
        creator: user,
        show: 'private',
        access: 'private',
        createdAt: Math.floor(Date.now() / 1000),
        updatedAt: Math.floor(Date.now() / 1000),
        upvotes: [],
        downvotes: []
      });
      done();
    });
  });

  describe('Testing the save method', function() {
    it('Should be able to save without problems', function() {
      notebook.save(function(err) {
        should.not.exist(err);
      });
    });
    it('Should not be able to save a notebook without a title',
      function() {
        notebook.title = '';
        notebook.save(function(err) {
          should.exist(err);
        });
      }); 
    it('Should ensure that downvotes is of type Array',
      function() {
        notebook.downvotes = 'I am not an array';
        notebook.save(function(err) {
          should.exist(err);
        });
      });
    it('Should ensure that upvotes is of type Array',
      function() {
        notebook.upvotes = 'I am not an array';
        notebook.save(function(err) {
          should.exist(err);
        });
      });
    it('Should ensure that lines is of type Array',
      function() {
        notebook.lines = 'I am not an array';
        notebook.save(function(err) {
          should.exist(err);
        });
      });
    it('Should ensure that show contains name only in public/private', 
      function() {
        notebook.show = 'not public or private';
        notebook.save(function(err) {
          should.exist(err);
        });
        notebook.show = 'private';
        notebook.save(function(err) {
          should.not.exist(err);
        });
        notebook.show = 'public';
        notebook.save(function(err) {
          should.not.exist(err);
        });
      });
    it('Should ensure that access contains name only in public/private', 
      function() {
        notebook.access = 'not public or private';
        notebook.save(function(err) {
          should.exist(err);
        });
        notebook.access = 'private';
        notebook.save(function(err) {
          should.not.exist(err);
        });
        notebook.access = 'public';
        notebook.save(function(err) {
          should.not.exist(err);
        });
      });
  });

  afterEach(function(done) {
    Notebook.remove(function() {
      User.remove(function() {
        done();
      }); 
    });
  }); 
});

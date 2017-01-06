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
        lines: {
          '0': 'line 1',
          '1': 'line 2'
        },
        creator_id: user.id,
        creator: user
      });
      done();
    });
  })

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
      }); });
  afterEach(function(done) {
    Notebook.remove(function() {
      User.remove(function() {
        done();
      }); 
    });
  }); 
});

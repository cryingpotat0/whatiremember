var request = require('supertest');
var server = request.agent('http://localhost:3000');
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Notebook = mongoose.model('Notebook');


function loginUser() {
    return function(done) {
        server
            .post('/api/login')
            .send({ username: 'username', password: 'password' })
            .expect(200)
            .end(onResponse);

        function onResponse(err, res) {
           if (err) return done(err);
           return done();
        }
    };
};
  /////
var user, notebook;
describe('Notebooks Controller Unit Tests:', function() {
  before(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password',
      provider: 'local'
    });
    user.save(function(error) {
      notebook = new Notebook({
        title: 'Notebook Title',
        lines: {
          '1': 'rags is awesome',
          '2': 'ohohohohoho'
        },
        creatorId: user.id,
        creator: user
      });
      notebook.save(function(err) {
        done();
      }); 
    });
  });
  describe('Testing the GET methods', function() {

    it('login', loginUser());
    it('Should be able to get the list of notebooks', function(done){
          server.get('/api/notebook/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              res.body.should.be.an.Array;
              res.body.should.have.lengthOf(1);
              res.body[0].should.have.property('title', notebook.title);
              res.body[0].should.have.property('lines', notebook.lines);
              done(); });
    })
    it('Should be able to get the specific notebook', function(done) {
      server.get('/api/notebook/' + notebook.id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          res.body.notebook.should.be.an.Object;
          res.body.notebook.should.have.property('title', notebook.title);
          res.body.notebook.should.have.property('lines', notebook.lines);
          done(); });
    });
  });
  after(function(done) {
    Notebook.remove().exec();
    User.remove().exec();
    done();
  }); 
});

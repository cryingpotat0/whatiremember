module.exports = {
  db: 'mongodb://localhost/mean-book',
  sessionSecret: 'developmentSessionSecret',
  facebook: {
    clientID: '1034354540020378',
    clientSecret: '524480bc12315722fa8fd151b4cc7c67',
    callbackURL: 'http://localhost:3000/oauth/facebook/callback',
  profileFields: ['id', 'email', 'displayName']
  },
};

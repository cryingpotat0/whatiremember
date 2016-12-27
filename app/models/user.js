var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    index: true,
    required: 'Email is required',
    match: [/.+\@.+\..+/, "Please fill a valid email address"]
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: 'Username is required'
  },
  password: {
    type: String,
    required: 'Password is required',
    validate: [
      function(password) {
        return password.length >= 6;
      },
      'Password should be longer'
    ]
  },
  salt: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerId: String,
  providerData: {}
});

UserSchema.pre('save', function(next) {
  if(this.password) {
    this.salt = new Buffer(crypto.randomBytes(15).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});

UserSchema.methods.hashPassword = function(password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

UserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

UserSchema.set('toJSON', 
  { getters: true, 
    virtuals: true });

mongoose.model('User', UserSchema);

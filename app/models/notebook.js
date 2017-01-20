var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = mongoose.model('User');
var max_lines = 10;

var NotebookSchema = new Schema({
  title: {
    type: String,
    required: 'Title is required'
  },
  lines: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Lines' 
  }],
  creator: { 
    type: Schema.ObjectId,
    ref: 'User',
    required: "Creator is required"
  },
  creatorId: {
    type: String,
    trim: true,
    required: "Creator ID is required",
    index: true
  },
  access: {
    type: String,
    enum: ['private', 'public']
  },
  show: {
    type: String,
    enum: ['private', 'public']
  },
  createdAt: {
    type: Number
  },
  updatedAt: {
    type: Number
  },
  upvotes: {
    type: Array
  },
  downvotes: {
    type: Array
  }
});

mongoose.model('Notebook', NotebookSchema);

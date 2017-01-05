var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var max_lines = 10;

var NotebookSchema = new Schema({
  title: {
    type: String,
    required: 'Title is required'
  },
  lines: {
    type: Object,
    validate: [
      function(lines) {
        count = 0;
        for (var line in lines) {
          if (lines.hasOwnProperty(line)){
            count++;
          }
        }
        return count <= max_lines;
      },
      'Maximum of ' + max_lines + ' lines'
    ]
  },
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
  }
});

mongoose.model('Notebook', NotebookSchema);

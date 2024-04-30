// models/Task.js

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Pendding'
  }
});

module.exports = mongoose.model('Task', taskSchema);

const mongoose = require('mongoose');

const patentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  transactionHash: {
    type: String,
    required: false
  }
}, { timestamps: true });

const Patent = mongoose.model('Patent', patentSchema);

module.exports = Patent;
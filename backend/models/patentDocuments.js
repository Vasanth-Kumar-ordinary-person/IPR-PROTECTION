const mongoose = require('mongoose');

const patentDocumentSchema = new mongoose.Schema({
  patentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patent',
    required: true
  },
  ipfsHash: {
    type: String,
    required: true
  },
  tempIpfsHash: {
    type: String,
    required: true
  },
  fileName: String,
  fileType: String,
  fileSize: Number
}, { timestamps: true });

// Add pre-save middleware to ensure ipfsHash is present
patentDocumentSchema.pre('save', function(next) {
  if (!this.ipfsHash) {
    next(new Error('IPFS hash is required'));
  }
  next();
});

const PatentDocument = mongoose.model('PatentDocument', patentDocumentSchema);

module.exports = PatentDocument;
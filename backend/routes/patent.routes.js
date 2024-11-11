const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const Patent = require('../models/patent');
const PatentDocument = require('../models/patentDocuments');
const { create } = require('ipfs-http-client');
const mongoose = require('mongoose');

// Initialize IPFS client
const ipfs = create({
  host: 'localhost',
  port: 5001,
  protocol: 'http'
});

// Upload to IPFS endpoint
router.post('/upload-ipfs', upload.single('file'), async (req, res) => {
  try {
    console.log('📤 Uploading file to IPFS...');
    
    if (!req.file) {
      console.log('❌ No file received');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload file to IPFS
    const fileResult = await ipfs.add(req.file.buffer);
    const ipfsHash = fileResult.path;

    // Upload metadata to IPFS
    const metadata = {
      title: req.body.title,
      description: req.body.description,
      fileName: req.file.originalname,
      contentType: req.file.mimetype,
      fileHash: ipfsHash
    };

    const metadataResult = await ipfs.add(JSON.stringify(metadata));
    const metadataHash = metadataResult.path;

    console.log('✅ File uploaded to IPFS successfully:', {
      fileHash: ipfsHash,
      metadataHash: metadataHash
    });

    res.json({ 
      ipfsHash: metadataHash,
      fileHash: ipfsHash
    });

  } catch (error) {
    console.error('❌ Error uploading to IPFS:', error);
    res.status(500).json({ 
      message: 'Error uploading to IPFS',
      error: error.message 
    });
  }
});

// File new patent
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    setProcessingTransaction(true);
    setMetamaskError('');
    setSubmitSuccess(false);

    // Basic validation
    if (!formData.title?.trim() || !formData.description?.trim() || !formData.file) {
      throw new Error('Please fill in all required fields');
    }

    // Connect to Web3
    if (!window.ethereum) {
      throw new Error('Please install MetaMask');
    }

    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await web3.eth.getAccounts();
    
    if (!accounts || accounts.length === 0) {
      throw new Error('Please connect your wallet');
    }

    // Create IPFS hash placeholder (in production, you'd generate this properly)
    const ipfsHash = `QmTemp${Date.now()}`;
    
    // Initialize contract
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // File patent on blockchain
    const tx = await contract.methods
      .filePatent(ipfsHash)
      .send({
        from: accounts[0],
        gas: 200000
      });

    // Prepare form data
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title.trim());
    formDataToSend.append('description', formData.description.trim());
    formDataToSend.append('file', formData.file);

    // Submit to backend through Redux
    await dispatch(filePatent({
      formData: formDataToSend,
      transactionHash: tx.transactionHash,
      ipfsHash: ipfsHash
    })).unwrap();
    
    // Reset form and show success
    setFormData({ title: '', description: '', file: null });
    setSubmitSuccess(true);

  } catch (error) {
    console.error('Error:', error);
    setMetamaskError(error?.message || 'An unexpected error occurred');
  } finally {
    setProcessingTransaction(false);
  }
};

// Get user's patents
router.get('/my/:userId', async (req, res) => {
  try {
    console.log('📋 Fetching patents for user:', req.params.userId);
    const patents = await Patent.find({ owner: req.params.userId })
      .populate('document')
      .populate('owner', 'username email')
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${patents.length} patents`);
    res.json(patents);
  } catch (error) {
    console.error('❌ Error fetching patents:', error);
    res.status(500).json({ 
      message: 'Error fetching patents',
      error: error.message 
    });
  }
});

// Get all patents
router.get('/all', async (req, res) => {
  try {
    console.log('📋 Fetching all patents');
    const patents = await Patent.find()
      .populate('document')
      .populate('owner', 'username email')
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${patents.length} total patents`);
    res.json(patents);
  } catch (error) {
    console.error('❌ Error fetching all patents:', error);
    res.status(500).json({ 
      message: 'Error fetching all patents',
      error: error.message 
    });
  }
});

// Get single patent
router.get('/:id', async (req, res) => {
  try {
    console.log('🔍 Fetching patent:', req.params.id);
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid patent ID' });
    }

    const patent = await Patent.findById(req.params.id)
      .populate('document')
      .populate('owner', 'username email');

    if (!patent) {
      console.log('❌ Patent not found');
      return res.status(404).json({ message: 'Patent not found' });
    }

    console.log('✅ Patent found');
    res.json(patent);
  } catch (error) {
    console.error('❌ Error fetching patent:', error);
    res.status(500).json({ 
      message: 'Error fetching patent',
      error: error.message 
    });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { uploadToIPFS, getFromIPFS } = require('../config/ipfs');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Upload file to IPFS
router.post('/upload', protect, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file provided'
            });
        }

        const ipfsHash = await uploadToIPFS(req.file.buffer);
        
        res.json({
            success: true,
            ipfsHash,
            fileName: req.file.originalname
        });
    } catch (error) {
        console.error('IPFS upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading to IPFS'
        });
    }
});

// Get file from IPFS
router.get('/:hash', async (req, res) => {
    try {
        const data = await getFromIPFS(req.params.hash);
        
        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'File not found on IPFS'
            });
        }

        res.send(data);
    } catch (error) {
        console.error('IPFS retrieval error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving from IPFS'
        });
    }
});

module.exports = router;
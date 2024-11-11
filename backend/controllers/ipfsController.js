const { uploadToIPFS } = require('../config/ipfs');

const ipfsController = {
  uploadFile: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const ipfsHash = await uploadToIPFS(req.file.buffer);
      res.json({ 
        hash: ipfsHash,
        url: `http://localhost:8080/ipfs/${ipfsHash}`
      });
    } catch (error) {
      console.error('IPFS upload error:', error);
      res.status(500).json({ message: 'Error uploading to IPFS' });
    }
  },

  getFile: async (req, res) => {
    try {
      const { hash } = req.params;
      const fileData = await getFromIPFS(hash);
      res.send(fileData);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching from IPFS' });
    }
  }
};

module.exports = ipfsController;
// ... existing code ...
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import { create } from 'ipfs-http-client';
// ... rest of the code remains the same ...

const app = express();
app.use(cors());
app.use(express.json());

// IPFS client setup
const ipfs = create({ host: 'localhost', port: '5001', protocol: 'http' });

// MySQL connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'patent_system'
});

// File patent endpoint
app.post('/api/patents', async (req, res) => {
    try {
        const { title, document, userAddress } = req.body;
        
        // Upload to IPFS
        const result = await ipfs.add(Buffer.from(document));
        const ipfsHash = result.path;
        
        // Store in MySQL
        const connection = await pool.getConnection();
        await connection.execute(
            'INSERT INTO patents (blockchain_id, owner_address, ipfs_hash, title) VALUES (?, ?, ?, ?)',
            [1, userAddress, ipfsHash, title]
        );
        
        connection.release();
        res.json({ success: true, ipfsHash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 
import { useState } from 'react';
import { ethers } from 'ethers';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { useSelector } from 'react-redux';

// ABI for your smart contract (you'll need to create this)
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "officer",
            "type": "address"
          }
        ],
        "name": "OfficerAdded",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "officer",
            "type": "address"
          }
        ],
        "name": "OfficerRemoved",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "approvedBy",
            "type": "address"
          }
        ],
        "name": "PatentApproved",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          }
        ],
        "name": "PatentFiled",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "officer",
            "type": "address"
          }
        ],
        "name": "addPatentOfficer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "admin",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "patentId",
            "type": "uint256"
          }
        ],
        "name": "approvePatent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          }
        ],
        "name": "filePatent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "patentId",
            "type": "uint256"
          }
        ],
        "name": "getPatent",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "ipfsHash",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "isApproved",
                "type": "bool"
              },
              {
                "internalType": "address",
                "name": "approvedBy",
                "type": "address"
              }
            ],
            "internalType": "struct IPProtection.Patent",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "patentCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "patentOfficers",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "patents",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isApproved",
            "type": "bool"
          },
          {
            "internalType": "address",
            "name": "approvedBy",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "officer",
            "type": "address"
          }
        ],
        "name": "removePatentOfficer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
];

const contractAddress = "0x769246FA14a40fE95961573F4BcfEFd70ef73b83"; // Deploy your contract and add address here

const FilePatent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [patentData, setPatentData] = useState({
    title: '',
    description: '',
    inventors: '',
    category: ''
  });

  const user = useSelector(state => state.auth.user);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to file patents!");
      }
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const filePatent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Connect to MetaMask
      const connected = await connectWallet();
      if (!connected) return;

      // Get the provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create contract instance
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      // Calculate filing fee (example: 0.01 ETH)
      const filingFee = ethers.utils.parseEther("0.01");

      // File patent transaction
      const transaction = await contract.filePatent(
        patentData.title,
        patentData.description,
        patentData.inventors,
        patentData.category,
        { value: filingFee }
      );

      // Wait for transaction to be mined
      await transaction.wait();

      // Save to your backend
      const response = await fetch('/api/v1/patents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          ...patentData,
          transactionHash: transaction.hash,
          blockchainId: transaction.events[0].args.patentId.toString()
        })
      });

      if (!response.ok) throw new Error('Failed to save patent details');

      setSuccess(true);
      setPatentData({
        title: '',
        description: '',
        inventors: '',
        category: ''
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          File New Patent
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Patent filed successfully!
          </Alert>
        )}

        <form onSubmit={filePatent}>
          <TextField
            fullWidth
            label="Patent Title"
            value={patentData.title}
            onChange={(e) => setPatentData({...patentData, title: e.target.value})}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Description"
            value={patentData.description}
            onChange={(e) => setPatentData({...patentData, description: e.target.value})}
            margin="normal"
            multiline
            rows={4}
            required
          />
          
          <TextField
            fullWidth
            label="Inventors"
            value={patentData.inventors}
            onChange={(e) => setPatentData({...patentData, inventors: e.target.value})}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Category"
            value={patentData.category}
            onChange={(e) => setPatentData({...patentData, category: e.target.value})}
            margin="normal"
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'File Patent (0.01 ETH)'
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default FilePatent;
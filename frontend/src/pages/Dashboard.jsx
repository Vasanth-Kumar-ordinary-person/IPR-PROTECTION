import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  TextField,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { CloudUpload, Visibility, AccountBalanceWallet } from '@mui/icons-material';
import { filePatent, getMyPatents } from '../store/slices/patentSlice';

// Contract configuration
const contractAddress = "0xa8f4669E93092A21b60A160108503f3e8d13eb4E";
const FILING_FEE = "0.01"; // ETH
const GANACHE_URL = 'http://127.0.0.1:7545';
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
    "inputs": [],
    "name": "FILING_FEE",
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
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "filePatent",
    "outputs": [],
    "stateMutability": "payable",
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
  }
];
const Dashboard = () => {
  // Redux hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { myPatents, error } = useSelector((state) => state.patents);

  // Local state
  const [loading, setLoading] = useState(false);
  const [processingTransaction, setProcessingTransaction] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null
  });
  const [fileError, setFileError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [metamaskError, setMetamaskError] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [tempIpfsHash, setTempIpfsHash] = useState('');

  // Navigation guard
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Form handlers
  



// Helper function to check if connected to Ganache
const checkGanacheConnection = async (provider) => {
  try {
    const network = await provider.getNetwork();
    const isGanache = network.chainId === 1337 || network.chainId === 5777;
    if (!isGanache) {
      throw new Error('Please connect to Ganache network');
    }
    return true;
  } catch (error) {
    console.error('Network check failed:', error);
    throw new Error('Please make sure Ganache is running and connected');
  }
};
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setSubmitSuccess(false);
    setMetamaskError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setFileError('File size must be less than 50MB');
        return;
      }
      setFileError('');
      setFormData({
        ...formData,
        file: file
      });
    }
  };

  // Wallet connection
  

  // Form submission
  
  // ... existing code ...

  // ... imports remain the same ...

  // Utility functions for blockchain interaction
// Debug logger
const debugLog = (stage, data) => {
  console.log(`[Patent Filing - ${stage}]:`, data);
};

// Utility functions with enhanced error checking
const connectToGanache = async () => {
  try {
    debugLog('Ganache Connection', 'Attempting to connect...');
    const web3 = new Web3(new Web3.providers.HttpProvider(GANACHE_URL));
    
    // Verify connection
    const isListening = await web3.eth.net.isListening();
    if (!isListening) throw new Error('Cannot connect to Ganache network');
    
    // Verify network ID
    const networkId = await web3.eth.net.getId();
    debugLog('Network ID', networkId);
    
    return web3;
  } catch (error) {
    debugLog('Ganache Connection Error', error);
    throw new Error(`Ganache connection failed: ${error.message}`);
  }
};

const verifyContract = async (web3, contractAddress) => {
  try {
    debugLog('Contract Verification', 'Starting...');
    
    // Check if contract address is valid
    if (!web3.utils.isAddress(contractAddress)) {
      throw new Error('Invalid contract address');
    }
    
    // Check contract code exists at address
    const code = await web3.eth.getCode(contractAddress);
    if (code === '0x' || code === '0x0') {
      throw new Error('No contract code at specified address');
    }
    
    // Initialize contract
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    
    // Verify contract has required method
    if (!contract.methods.filePatent) {
      throw new Error('Contract missing filePatent method');
    }
    
    debugLog('Contract Verification', 'Success');
    return contract;
  } catch (error) {
    debugLog('Contract Verification Error', error);
    throw new Error(`Contract verification failed: ${error.message}`);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    debugLog('Submission', 'Starting patent filing process');
    setProcessingTransaction(true);
    setMetamaskError('');
    setSubmitSuccess(false);

    // Form validation
    if (!formData.title?.trim() || !formData.description?.trim() || !formData.file) {
      throw new Error('Please fill in all required fields');
    }

    // Step 1: Setup Web3 and contract
    const web3 = new Web3(new Web3.providers.HttpProvider(GANACHE_URL));
    debugLog('Web3', 'Connected to Ganache');
    
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error('No Ganache accounts available');
    }
    const senderAddress = accounts[0];
    debugLog('Account', senderAddress);

    const balance = await web3.eth.getBalance(senderAddress);
    const balanceEth = web3.utils.fromWei(balance, 'ether');
    if (parseFloat(balanceEth) < parseFloat(FILING_FEE)) {
      throw new Error(`Insufficient balance. Required: ${FILING_FEE} ETH, Available: ${balanceEth} ETH`);
    }
    debugLog('Balance', `${balanceEth} ETH`);

    // Step 2: Create temporary hash for blockchain transaction
    const tempHash = `QmTemp${Date.now()}`;
    debugLog('Temporary Hash', tempHash);

    // Step 3: Execute blockchain transaction with temporary hash
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const filingFeeWei = web3.utils.toWei(FILING_FEE, 'ether');
    
    debugLog('Contract', 'Estimating gas...');
    const gasEstimate = await contract.methods
      .filePatent(tempHash)
      .estimateGas({ 
        from: senderAddress,
        value: filingFeeWei
      });
    
    const gasPrice = await web3.eth.getGasPrice();
    debugLog('Gas Estimate', gasEstimate);
    debugLog('Gas Price', gasPrice);

    debugLog('Transaction', 'Sending transaction...');
    const tx = await contract.methods
      .filePatent(tempHash)
      .send({
        from: senderAddress,
        gas: Math.floor(gasEstimate * 1.2),
        gasPrice: gasPrice,
        value: filingFeeWei
      });
    
    debugLog('Transaction Hash', tx.transactionHash);

    // Step 4: Submit patent filing to backend
    debugLog('Backend', 'Submitting patent data...');
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title.trim());
    formDataToSend.append('description', formData.description.trim());
    formDataToSend.append('file', formData.file);
    formDataToSend.append('transactionHash', tx.transactionHash);
    formDataToSend.append('ipfsHash', tempHash); // Using temporary hash for now

    await dispatch(filePatent({
      formData: formDataToSend
    })).unwrap();

    // Step 5: Refresh patents list and reset form
    await dispatch(getMyPatents());
    setFormData({ title: '', description: '', file: null });
    setSubmitSuccess(true);
    debugLog('Success', 'Patent filing complete');

  } catch (error) {
    console.error('Patent Filing Error:', error);
    let errorMessage = '';
    
    const errorString = error?.message || error?.toString() || 'An unknown error occurred';
    
    if (typeof errorString === 'string') {
      if (errorString.toLowerCase().includes('revert')) {
        errorMessage = 'Blockchain transaction failed: Please ensure you\'re sending the correct filing fee (0.01 ETH)';
      } else if (errorString.toLowerCase().includes('insufficient')) {
        errorMessage = 'Insufficient funds in your account. Please ensure you have enough ETH.';
      } else if (errorString.toLowerCase().includes('network')) {
        errorMessage = 'Cannot connect to Ganache. Please ensure it is running.';
      } else {
        errorMessage = errorString;
      }
    } else {
      errorMessage = 'An unexpected error occurred. Please try again.';
    }
    
    setMetamaskError(errorMessage);
  } finally {
    setProcessingTransaction(false);
  }
};

// Add this utility function for updating IPFS hash later
const updatePatentWithIPFSHash = async (patentId, ipfsHash) => {
  try {
    await axios.patch(`/api/v1/patents/${patentId}/ipfs`, { ipfsHash });
    await dispatch(getMyPatents()); // Refresh the patents list
  } catch (error) {
    console.error('Failed to update IPFS hash:', error);
  }
};

// ... rest of the component remains the same ...
// ... existing code ...
  // Helper function for status color
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED': return 'success';
      case 'PENDING': return 'warning';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container>
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* Patent Filing Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" color="primary">
                File New Patent
              </Typography>
              <Chip
                icon={<AccountBalanceWallet />}
                label={`Fee: ${FILING_FEE} ETH`}
                color="primary"
                variant="outlined"
              />
            </Box>

            {metamaskError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {metamaskError.replace('MetaMask', 'Ganache')}
              </Alert>
            )}

            {submitSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Patent filed successfully on blockchain and IPFS!
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  name="title"
                  label="Patent Title"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!formData.title?.trim()}
                  helperText={!formData.title?.trim() ? 'Title is required' : ''}
                  disabled={processingTransaction}
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <TextField
                  name="description"
                  label="Patent Description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  fullWidth
                  required
                  error={!formData.description?.trim()}
                  helperText={!formData.description?.trim() ? 'Description is required' : ''}
                  disabled={processingTransaction}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <input
                  type="file"
                  id="patent-file-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  disabled={processingTransaction}
                />
                <label htmlFor="patent-file-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    fullWidth
                    disabled={processingTransaction}
                    sx={{
                      borderColor: !formData.file ? 'error.main' : undefined,
                      color: !formData.file ? 'error.main' : undefined
                    }}
                  >
                    {formData.file ? 'Change File' : 'Upload Patent Document'}
                  </Button>
                </label>
                {formData.file && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Selected file: {formData.file.name}
                  </Typography>
                )}
                {!formData.file && (
                  <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                    Please upload a patent document
                  </Typography>
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={processingTransaction || !formData.title?.trim() || !formData.description?.trim() || !formData.file}
                fullWidth
                sx={{ height: 48 }}
              >
                {processingTransaction ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    <Typography variant="button">
                      Processing Transaction...
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalanceWallet />
                    <Typography variant="button">
                      File Patent
                    </Typography>
                  </Box>
                )}
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* My Patents List */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
              My Patents ({myPatents?.length || 0})
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress />
              </Box>
            ) : myPatents?.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="textSecondary">
                  You haven't filed any patents yet.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ maxHeight: '600px', overflow: 'auto' }}>
                {myPatents?.map((patent) => (
                  <Card key={patent._id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {patent.title}
                      </Typography>
                      <Box sx={{ mb: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={patent.status}
                          color={getStatusColor(patent.status)}
                          size="small"
                        />
                        {patent?.document?.ipfsHash && (
                          <Chip
                            label="IPFS"
                            color="info"
                            size="small"
                            variant="outlined"
                          />
                        )}
                        <Chip
                          label="Blockchain"
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {patent.description?.substring(0, 100)}
                        {patent.description?.length > 100 ? '...' : ''}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        component={Link}
                        to={`/patents/${patent._id}`}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
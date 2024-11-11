import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Web3 from 'web3';
const contractABI=[
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

const contractAddress="0x769246FA14a40fE95961573F4BcfEFd70ef73b83";

const API_URL = 'http://localhost:5000/api/v1';

const GANACHE_URL='http://localhost:7545'
// File new patent
// ... existing code ...

// ... imports remain the same ...





// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const filePatent = createAsyncThunk(
  'patents/filePatent',
  async ({ formData, transactionHash, ipfsHash }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      // First, upload file to IPFS
      const fileFormData = new FormData();
      fileFormData.append('file', formData.get('file'));
      
      const ipfsResponse = await axios.post(
        `${API_URL}/ipfs/upload`, 
        fileFormData, 
        config
      );

      // Create patent with IPFS hash
      const patentFormData = new FormData();
      patentFormData.append('title', formData.get('title'));
      patentFormData.append('description', formData.get('description'));
      patentFormData.append('transactionHash', transactionHash);
      patentFormData.append('ipfsHash', ipfsResponse.data.ipfsHash);

      const response = await axios.post(
        `${API_URL}/patents`, 
        patentFormData, 
        config
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('Please login again to continue');
      }
      return rejectWithValue(error.response?.data || 'Failed to submit patent');
    }
  }
);

export const getMyPatents = createAsyncThunk(
  'patents/getMyPatents',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/patents/my`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('Please login again to continue');
      }
      return rejectWithValue(error.response?.data || 'Failed to fetch patents');
    }
  }
);

export const getAllPatents = createAsyncThunk(
  'patents/getAllPatents',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/patents`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('Please login again to continue');
      }
      return rejectWithValue(error.response?.data || 'Failed to fetch patents');
    }
  }
);

export const getPatentById = createAsyncThunk(
  'patents/getPatentById',
  async (patentId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/patents/${patentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('Please login again to continue');
      }
      return rejectWithValue(error.response?.data || 'Failed to fetch patent details');
    }
  }
);

// ... rest of the slice remains the same ...



// ... rest of the slice remains the same ...

const patentSlice = createSlice({
  name: 'patents',
  initialState: {
    myPatents: [],
    allPatents: [],
    loading: false,
    error: null,
    currentPatent: null,
   
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetState: (state) => {
      state.myPatents = [];
      state.allPatents = [];
      state.loading = false;
      state.error = null;
      state.currentPatent = null;
      state.success = false;
    },
    setCurrentPatent: (state, action) => {
      state.currentPatent = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // File Patent
      .addCase(filePatent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(filePatent.fulfilled, (state, action) => {
        state.loading = false;
        state.myPatents = [action.payload, ...state.myPatents];
        state.error = null;
        state.success = true;
      })
      .addCase(filePatent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Get My Patents
      .addCase(getMyPatents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyPatents.fulfilled, (state, action) => {
        state.loading = false;
        state.myPatents = action.payload;
        state.error = null;
      })
      .addCase(getMyPatents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get All Patents
      .addCase(getAllPatents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPatents.fulfilled, (state, action) => {
        state.loading = false;
        state.allPatents = action.payload;
        state.error = null;
      })
      .addCase(getAllPatents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Patent By Id
      .addCase(getPatentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPatentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatent = action.payload;
        state.error = null;
      })
      .addCase(getPatentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearError, 
  clearSuccess, 
  resetState, 
  setCurrentPatent 
} = patentSlice.actions;

export default patentSlice.reducer;
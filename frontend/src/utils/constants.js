export const PATENT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export const USER_ROLES = {
  USER: 'user',
  OFFICER: 'officer',
  ADMIN: 'admin',
};

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  PATENTS: {
    BASE: '/patents',
    FILE: '/patents/file',
    VERIFY: '/patents/verify',
    MY_PATENTS: '/patents/my',
  },
  IPFS: {
    UPLOAD: '/ipfs/upload',
    GET: '/ipfs/get',
  },
};

export const BLOCKCHAIN_ERRORS = {
  NOT_INITIALIZED: 'Web3 not initialized',
  NO_METAMASK: 'MetaMask is not installed',
  WRONG_NETWORK: 'Please connect to the correct network',
  TRANSACTION_FAILED: 'Transaction failed',
}; 
import { create } from 'ipfs-http-client';

const ipfs = create({
  host: 'localhost',
  port: 5001,
  protocol: 'http'
});

export const uploadToIPFS = async (file) => {
  try {
    const added = await ipfs.add(file);
    console.log('IPFS hash:', added.path);
    return added.path;
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw error;
  }
};
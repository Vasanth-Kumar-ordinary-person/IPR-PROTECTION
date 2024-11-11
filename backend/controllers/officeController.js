const Patent = require('../models/patent');
const User = require('../models/user');
const Web3 = require('web3');
const contractABI = require('../config/contractABI.json'); // You'll need to create this
const { sendNotificationEmail } = require('../services/emailService'); // Optional: for notifications

const web3 = new Web3(process.env.BLOCKCHAIN_URL || 'http://localhost:8545');
const contract = new web3.eth.Contract(
    contractABI,
    process.env.CONTRACT_ADDRESS
);

const officerController = {
    // Get all pending patents
    async getPendingPatents(req, res) {
        try {
            const pendingPatents = await Patent.find({ status: 'pending' })
                .populate('owner', 'username email walletAddress')
                .sort({ createdAt: -1 });

            res.json(pendingPatents);
        } catch (error) {
            console.error('Error fetching pending patents:', error);
            res.status(500).json({ message: 'Error fetching pending patents' });
        }
    },

    // Get all patents (with optional filters)
    async getAllPatents(req, res) {
        try {
            const { status, page = 1, limit = 10 } = req.query;
            const query = status ? { status } : {};

            const patents = await Patent.find(query)
                .populate('owner', 'username email walletAddress')
                .populate('approvedBy', 'username email')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));

            const total = await Patent.countDocuments(query);

            res.json({
                patents,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total
            });
        } catch (error) {
            console.error('Error fetching patents:', error);
            res.status(500).json({ message: 'Error fetching patents' });
        }
    },

    // Approve a patent
    async approvePatent(req, res) {
        try {
            const { patentId } = req.params;
            const { remarks } = req.body;

            const patent = await Patent.findById(patentId);
            if (!patent) {
                return res.status(404).json({ message: 'Patent not found' });
            }

            if (patent.status !== 'pending') {
                return res.status(400).json({ message: 'Patent is not in pending status' });
            }

            // Update blockchain
            try {
                const accounts = await web3.eth.getAccounts();
                await contract.methods.approvePatent(patent.blockchainId)
                    .send({ from: accounts[0] }); // You might want to use the officer's address instead
            } catch (blockchainError) {
                console.error('Blockchain error:', blockchainError);
                return res.status(500).json({ message: 'Error updating blockchain' });
            }

            // Update database
            patent.status = 'approved';
            patent.approvedBy = req.user._id;
            patent.remarks = remarks;
            patent.updatedAt = Date.now();
            await patent.save();

            // Optional: Send notification email to patent owner
            try {
                const owner = await User.findById(patent.owner);
                await sendNotificationEmail(
                    owner.email,
                    'Patent Approved',
                    `Your patent "${patent.title}" has been approved.`
                );
            } catch (emailError) {
                console.error('Email notification error:', emailError);
                // Don't return error as email is not critical
            }

            res.json({
                message: 'Patent approved successfully',
                patent
            });
        } catch (error) {
            console.error('Error approving patent:', error);
            res.status(500).json({ message: 'Error approving patent' });
        }
    },

    // Reject a patent
    async rejectPatent(req, res) {
        try {
            const { patentId } = req.params;
            const { rejectionReason } = req.body;

            if (!rejectionReason) {
                return res.status(400).json({ message: 'Rejection reason is required' });
            }

            const patent = await Patent.findById(patentId);
            if (!patent) {
                return res.status(404).json({ message: 'Patent not found' });
            }

            if (patent.status !== 'pending') {
                return res.status(400).json({ message: 'Patent is not in pending status' });
            }

            // Update database
            patent.status = 'rejected';
            patent.approvedBy = req.user._id;
            patent.rejectionReason = rejectionReason;
            patent.updatedAt = Date.now();
            await patent.save();

            // Optional: Send notification email to patent owner
            try {
                const owner = await User.findById(patent.owner);
                await sendNotificationEmail(
                    owner.email,
                    'Patent Rejected',
                    `Your patent "${patent.title}" has been rejected. Reason: ${rejectionReason}`
                );
            } catch (emailError) {
                console.error('Email notification error:', emailError);
                // Don't return error as email is not critical
            }

            res.json({
                message: 'Patent rejected successfully',
                patent
            });
        } catch (error) {
            console.error('Error rejecting patent:', error);
            res.status(500).json({ message: 'Error rejecting patent' });
        }
    },

    // Get officer statistics
    async getStatistics(req, res) {
        try {
            const stats = await Patent.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]);

            const totalPatents = await Patent.countDocuments();
            const pendingPatents = await Patent.countDocuments({ status: 'pending' });
            const approvedToday = await Patent.countDocuments({
                status: 'approved',
                updatedAt: {
                    $gte: new Date().setHours(0, 0, 0, 0)
                }
            });

            res.json({
                totalPatents,
                pendingPatents,
                approvedToday,
                statusBreakdown: stats
            });
        } catch (error) {
            console.error('Error fetching statistics:', error);
            res.status(500).json({ message: 'Error fetching statistics' });
        }
    },

    // Get officer activity log
    async getActivityLog(req, res) {
        try {
            const activities = await Patent.find({
                approvedBy: req.user._id
            })
            .select('title status updatedAt rejectionReason')
            .sort({ updatedAt: -1 })
            .limit(50);

            res.json(activities);
        } catch (error) {
            console.error('Error fetching activity log:', error);
            res.status(500).json({ message: 'Error fetching activity log' });
        }
    }
};

module.exports = officerController;
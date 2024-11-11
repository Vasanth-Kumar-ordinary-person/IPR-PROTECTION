const User = require('../models/user');
const Patent = require('../models/patent');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userController = {
    // Authentication Methods
    async login(req, res) {
        try {
            const { username, password } = req.body;

            // Validate input
            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide username and password'
                });
            }

            // Find user
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Generate token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Send response
            res.json({
                success: true,
                token,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });

        } catch (error) {
            console.error('Login Error:', error);
            res.status(500).json({
                success: false,
                message: 'Error during login'
            });
        }
    },

    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            // Validate input
            if (!username || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide all required fields'
                });
            }

            // Check if user exists
            const existingUser = await User.findOne({ 
                $or: [{ username }, { email }] 
            });
            
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Username or email already exists'
                });
            }

            // Create new user
            const user = await User.create({
                username,
                email,
                password // Password will be hashed in the User model pre-save middleware
            });

            // Generate token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Send response
            res.status(201).json({
                success: true,
                token,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });

        } catch (error) {
            console.error('Registration Error:', error);
            res.status(500).json({
                success: false,
                message: 'Error during registration'
            });
        }
    },

    // Profile Methods
    async getProfile(req, res) {
        try {
            const user = await User.findById(req.user._id)
                .select('-password')
                .lean();

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                user
            });
        } catch (error) {
            console.error('Get Profile Error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching profile'
            });
        }
    },

    async updateProfile(req, res) {
        try {
            const { username, email } = req.body;
            
            // Validate input
            if (!username && !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide fields to update'
                });
            }

            // Check for existing username/email
            if (username || email) {
                const existingUser = await User.findOne({
                    _id: { $ne: req.user._id },
                    $or: [
                        username ? { username } : {},
                        email ? { email } : {}
                    ]
                });

                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: 'Username or email already exists'
                    });
                }
            }

            const updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                { $set: { username, email } },
                { new: true, runValidators: true }
            ).select('-password');

            res.json({
                success: true,
                message: 'Profile updated successfully',
                user: updatedUser
            });
        } catch (error) {
            console.error('Update Profile Error:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating profile'
            });
        }
    },

    // Patent Methods
    async filePatent(req, res) {
        try {
            const { title, description } = req.body;
            
            if (!title || !description) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide title and description'
                });
            }

            const patent = await Patent.create({
                title,
                description,
                owner: req.user._id
            });

            res.status(201).json({
                success: true,
                patent
            });
        } catch (error) {
            console.error('File Patent Error:', error);
            res.status(500).json({
                success: false,
                message: 'Error filing patent'
            });
        }
    },

    async getUserPatents(req, res) {
        try {
            const patents = await Patent.find({ owner: req.user._id })
                .sort({ createdAt: -1 })
                .lean();

            res.json({
                success: true,
                patents
            });
        } catch (error) {
            console.error('Get Patents Error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching patents'
            });
        }
    },

    async getPatentDetails(req, res) {
        try {
            const patent = await Patent.findOne({
                _id: req.params.id,
                owner: req.user._id
            }).lean();

            if (!patent) {
                return res.status(404).json({
                    success: false,
                    message: 'Patent not found'
                });
            }

            res.json({
                success: true,
                patent
            });
        } catch (error) {
            console.error('Get Patent Details Error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching patent details'
            });
        }
    }
};

module.exports = userController;
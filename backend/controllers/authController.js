const User = require('../models/user');
const jwt = require('jsonwebtoken');

const authController = {
    // Register new user
    register: async (req, res) => {
        try {
            const { username, email, password, walletAddress } = req.body;

            // Input validation
            if (!username || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide all required fields'
                });
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide a valid email address'
                });
            }

            // Check if user exists
            const existingUser = await User.findOne({ 
                $or: [
                    { email: email.toLowerCase() }, 
                    { username: username.toLowerCase() },
                    ...(walletAddress ? [{ walletAddress }] : [])
                ] 
            });

            if (existingUser) {
                return res.status(400).json({ 
                    success: false,
                    message: existingUser.email === email.toLowerCase() 
                        ? 'Email already registered' 
                        : existingUser.username === username.toLowerCase()
                        ? 'Username already taken'
                        : 'Wallet address already registered'
                });
            }

            // Create new user
            const user = new User({
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                password,
                walletAddress
            });

            await user.save();

            // Generate token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                success: true,
                message: 'Registration successful',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    walletAddress: user.walletAddress
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error registering user'
            });
        }
    },

    // Login user
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            
            if (user && (await user.matchPassword(password))) {
              res.json({
                _id: user._id,
                email: user.email,
                token: generateToken(user._id), // Make sure this generates a JWT token
                // ... other user data
              });
            } else {
              res.status(401).json({ message: 'Invalid email or password' });
            }
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
        });
        }
    },

    // Get current user profile
    getCurrentUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.userId).select('-password');
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
            console.error('Get user error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error fetching user data'
            });
        }
    },

    // Logout
    logout: async (req, res) => {
        try {
            // You might want to handle token invalidation here
            // For example, add the token to a blacklist in Redis
            res.json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error logging out'
            });
        }
    }
};

module.exports = authController;
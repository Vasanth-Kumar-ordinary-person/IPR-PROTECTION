const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = {
    protect: async (req, res, next) => {
        try {
            // Check for token in headers
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Access denied. No token provided' 
                });
            }

            const token = authHeader.split(' ')[1];

            try {
                // Verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                
                // Get user from database
                const user = await User.findById(decoded.userId).select('-password');
                
                if (!user) {
                    return res.status(401).json({ 
                        success: false,
                        message: 'User not found or deleted' 
                    });
                }

                // Check if token was issued before password change
                if (user.passwordChangedAt) {
                    const changedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
                    if (decoded.iat < changedTimestamp) {
                        return res.status(401).json({ 
                            success: false,
                            message: 'User recently changed password. Please login again' 
                        });
                    }
                }

                // Attach user and token to request object
                req.user = user;
                req.token = token;
                next();

            } catch (error) {
                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ 
                        success: false,
                        message: 'Invalid token' 
                    });
                }
                if (error.name === 'TokenExpiredError') {
                    return res.status(401).json({ 
                        success: false,
                        message: 'Token expired' 
                    });
                }
                throw error;
            }

        } catch (error) {
            console.error('Auth Middleware Error:', error);
            return res.status(500).json({ 
                success: false,
                message: 'Internal server error during authentication' 
            });
        }
    },

    logout: async (req, res, next) => {
        try {
            // Get token from header
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'No token provided'
                });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Find user and update lastLogout time
            const user = await User.findByIdAndUpdate(
                decoded.userId,
                { lastLogout: new Date() },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Clear any cookies if you're using them
            res.clearCookie('token');

            res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });

        } catch (error) {
            console.error('Logout Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error during logout'
            });
        }
    },

    restrictTo: (...roles) => {
        return (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ 
                    success: false,
                    message: 'You do not have permission to perform this action' 
                });
            }
            next();
        };
    },

    isLoggedIn: async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                req.user = null;
                return next();
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password');
            
            // Check if user has logged out after token was issued
            if (user?.lastLogout) {
                const tokenIssuedAt = new Date(decoded.iat * 1000);
                if (user.lastLogout > tokenIssuedAt) {
                    req.user = null;
                    return next();
                }
            }

            req.user = user || null;
            next();
        } catch (error) {
            req.user = null;
            next();
        }
    }
};

module.exports = authMiddleware;
module.exports.protect = authMiddleware.protect;
module.exports.restrictTo = authMiddleware.restrictTo;
module.exports.isLoggedIn = authMiddleware.isLoggedIn;
module.exports.logout = authMiddleware.logout;
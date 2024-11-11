const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const cors = require('cors');
const { protect, logout, isLoggedIn } = require('../middlewares/authMiddleware');

router.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

// Public routes (no authentication required)
router.post('/login', userController.login);
router.post('/register', userController.register);

// Logout route (requires authentication)
router.post('/logout', protect, logout);

// Protected routes (require authentication)
router.use(protect); // Apply authentication middleware to all routes below

// Patent routes
router.route('/patents')
  .post(userController.filePatent)
  .get(userController.getUserPatents);

router.get('/patents/:id', userController.getPatentDetails);

// Profile routes
router.route('/profile')
  .get(userController.getProfile)
  .put(userController.updateProfile);

// Optional: Add route to check authentication status
router.get('/check-auth', isLoggedIn, (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      user: {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
      }
    });
  } else {
    res.json({
      success: false,
      message: 'Not authenticated'
    });
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('User Routes Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = router;
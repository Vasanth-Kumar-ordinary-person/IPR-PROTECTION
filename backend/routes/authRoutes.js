const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
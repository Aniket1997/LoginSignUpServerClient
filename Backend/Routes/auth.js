// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Modal/User');

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, phoneNumber, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user._id, role: user.role }, 'I6IkpXVCJ9.eyJpZCI6IjY2NGE0Y2RkMjkwYWU4NDI2ODNkYTE2OCIsImlhdCI6MTcxNjE0NTkwMSwiZXhwIjozMTcyNjA1ODgzMDF9.UhcGbsXqcr36mQsMOgLjrcFqZf0RvoYYCiGnh5baYDw', { expiresIn: '1h' });
  
      // Send user details along with the token
      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role 
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// Admin login route
router.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.role !== 'admin') {
      return res.status(400).json({ message: 'Admin does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, 'I6IkpXVCJ9.eyJpZCI6IjY2NGE0Y2RkMjkwYWU4NDI2ODNkYTE2OCIsImlhdCI6MTcxNjE0NTkwMSwiZXhwIjozMTcyNjA1ODgzMDF9.UhcGbsXqcr36mQsMOgLjrcFqZf0RvoYYCiGnh5baYDw', { expiresIn: '3h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const verifyToken = (req, res, next) => {
    // Get token from authorization header
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
  
    try {
      // Verify token and decode payload
      const decoded = jwt.verify(token.split(' ')[1], 'I6IkpXVCJ9.eyJpZCI6IjY2NGE0Y2RkMjkwYWU4NDI2ODNkYTE2OCIsImlhdCI6MTcxNjE0NTkwMSwiZXhwIjozMTcyNjA1ODgzMDF9.UhcGbsXqcr36mQsMOgLjrcFqZf0RvoYYCiGnh5baYDw');
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  };
  
  // Route to fetch user data
  router.get('/user', verifyToken, async (req, res) => {
    try {
      // Fetch user details from database based on user id in decoded token
      const user = await User.findById(req.user.id).select('-password'); // Exclude password from response
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(user); // Return user data
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
module.exports = router;

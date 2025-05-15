const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ 
      $or: [
        { username: username.toLowerCase().trim() },
        { email: email.toLowerCase().trim() }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'Korisničko ime ili email već postoje!' 
      });
    }

    const newUser = new User({
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(201).json({
      success: true,
      message: 'Registracija uspješna!',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (err) {
    console.error('Greška pri registraciji:', err);
    res.status(500).json({
      success: false,
      error: 'Došlo je do greške prilikom registracije'
    });
  }
});

router.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  const cleanedInput = usernameOrEmail.trim().toLowerCase();

  try {
    const user = await User.findOne({
      $or: [
        { username: cleanedInput },
        { email: cleanedInput }
      ]
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Neispravni podaci za prijavu!'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Neispravni podaci za prijavu!'
      });
    }

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: 'Prijava uspješna!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Greška pri prijavi:', err);
    res.status(500).json({
      success: false,
      error: 'Došlo je do greške prilikom prijave'
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.patch('/users/me', auth, async (req, res) => {
  const { username, email } = req.body;

  try {
    if (username) {
      const existingUser = await User.findOne({ 
        username: username.toLowerCase(),
        _id: { $ne: req.user._id }
      });
      if (existingUser) return res.status(400).json({ error: 'Korisničko ime je zauzeto!' });
    }

    if (email) {
      const existingEmail = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: req.user._id }
      });
      if (existingEmail) return res.status(400).json({ error: 'Email je zauzet!' });
    }

    const updates = {};
    if (username) updates.username = username.trim().toLowerCase();
    if (email) updates.email = email.trim().toLowerCase();

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server greška' });
  }
});

router.patch('/users/me/password', auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'Korisnik nije pronađen.' });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return res.status(400).json({ error: 'Stara lozinka nije ispravna.' });

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Lozinka je promijenjena.' });
  } catch (error) {
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

module.exports = router;

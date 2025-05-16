const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const adminAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Nevažeći autorizacijski format' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('role');
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Nedovoljne ovlasti' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Nevažeći token' });
  }
};

router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({}, '-password -__v'); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Greška pri dohvaćanju korisnika' });
  }
});

router.get('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v');
    if (!user) {
      return res.status(404).json({ error: "Korisnik nije pronađen." });
    }
    res.json(user);
  } catch (err) {
    console.error("Greška pri dohvaćanju korisnika:", err);
    res.status(500).json({ error: "Greška na serveru." });
  }
});

router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const userId = req.params.id; 
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: "Korisnik nije pronađen." });
    }
    res.json({ message: "Korisnik uspješno obrisan." });
  } catch (err) {
    console.error("Greška pri brisanju korisnika:", err);
    res.status(500).json({ error: "Greška na serveru." });
  }
});

router.patch('/users/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Nevažeći ID korisnika.' });
    }

    const updates = {
      username: username?.trim().toLowerCase(),
      email: email?.trim().toLowerCase()
    };

    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true, context: 'query' }
    ).select('-password -__v');

    if (!user) return res.status(404).json({ error: 'Korisnik nije pronađen.' });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Greška pri ažuriranju korisnika:', error);
    res.status(500).json({ error: 'Server greška' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const adminAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Nedostaje token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Nemaš ovlasti za ovu radnju!' });
    }
    req.user = user; 
    next();
  } catch (err) {
    res.status(401).json({ error: 'Nevažeći token' });
  }
};

router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({}, '-password'); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Greška pri dohvaćanju korisnika' });
  }
});


router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const userId = req.params.id; // Ensure this matches the ID from the URL
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



module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Favorite = require('../models/Favorite');
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

    const existingUser = await User.findOne({
      $or: [
        { username: new RegExp(`^${username}$`, 'i') },
        { email: new RegExp(`^${email}$`, 'i') }
      ],
      _id: { $ne: id }
    });

    if (existingUser) {
      const field = existingUser.username === username ? 'username' : 'email';
      return res.status(400).json({ error: `${field} već postoji!` });
    }

    const updates = {
      username: username?.trim().toLowerCase(),
      email: email?.trim().toLowerCase()
    };

    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { 
        new: true,
        runValidators: true,
        context: 'query'
      }
    ).select('-password -__v');

    if (!user) {
      return res.status(404).json({ error: "Korisnik nije pronađen." });
    }

    res.json({ success: true, user });

  } catch (error) {
    console.error('Greška pri ažuriranju korisnika:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    res.status(500).json({ error: "Greška na serveru." });
  }
});

router.get('/users/:userId/cocktails', adminAuth, async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Nevažeći ID korisnika.' });
    }

    const favorites = await Favorite.find({ user: userId });
    if (!favorites.length) return res.json([]);

    const cocktails = await Promise.all(
      favorites.map(async (fav) => {
        try {
          const response = await fetch(
            `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${fav.cocktailId}`
          );
          const data = await response.json();
          return data.drinks?.[0] || null;
        } catch (error) {
          console.error(`Greška pri dohvatu koktela ${fav.cocktailId}:`, error);
          return null;
        }
      })
    );

    res.json(cocktails.filter(c => c !== null));

  } catch (err) {
    console.error("Greška pri dohvatu koktela:", err);
    res.status(500).json({ error: "Greška na serveru." });
  }
});

router.delete('/users/:userId/favorites/:cocktailId', adminAuth, async (req, res) => {
  try {
    const { userId, cocktailId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Nevažeći ID korisnika.' });
    }

    const result = await Favorite.deleteOne({ 
      user: userId, 
      cocktailId: cocktailId 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Favorit nije pronađen." });
    }

    res.json({ success: true });

  } catch (err) {
    console.error("Greška pri brisanju favorita:", err);
    res.status(500).json({ error: "Greška na serveru." });
  }
});

module.exports = router;

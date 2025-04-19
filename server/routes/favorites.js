const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Favorite = require('../models/Favorite');

// Dodaj u favorite
router.post('/', auth, async (req, res) => {
  try {
    const favorite = new Favorite({
      user: req.user.id,
      cocktailId: req.body.cocktailId
    });
    
    await favorite.save();
    res.status(201).json(favorite);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Cocktail je već u favoritima' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Ukloni iz favorita
router.delete('/:cocktailId', auth, async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: req.user.id,
      cocktailId: req.params.cocktailId
    });
    
    if (!favorite) {
      return res.status(404).json({ msg: 'Favorite nije pronađen' });
    }
    
    res.json({ msg: 'Favorite uklonjen' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Dohvati sve favorite korisnika
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .select('cocktailId -_id')
      .lean();
      
    const cocktailIds = favorites.map(f => f.cocktailId);
    res.json(cocktailIds);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

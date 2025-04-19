const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const auth = require('../middleware/auth'); 

router.post('/', auth, async (req, res) => {
  try {
    const { cocktailId } = req.body;
    const favorite = await Favorite.findOneAndUpdate(
      { user: req.user.id, cocktailId },
      { user: req.user.id, cocktailId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(favorite);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:cocktailId', auth, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({ user: req.user.id, cocktailId: req.params.cocktailId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).select('cocktailId -_id');
    res.json(favorites.map(f => f.cocktailId));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

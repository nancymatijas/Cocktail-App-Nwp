const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cocktailId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Spriječite duplikate
favoriteSchema.index({ user: 1, cocktailId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);

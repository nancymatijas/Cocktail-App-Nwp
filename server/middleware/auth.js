const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Autorizacijski token nije pronađen!' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select('-password -__v');
    
    if (!user) {
      return res.status(401).json({ error: 'Korisnik nije pronađen!' });
    }

    req.user = user;
    next();
  } catch (error) {
    let errorMessage = 'Došlo je do greške pri autentifikaciji';
    
    if (error.name === 'TokenExpiredError') {
      errorMessage = 'Token je istekao!';
    } else if (error.name === 'JsonWebTokenError') {
      errorMessage = 'Nevažeći token!';
    }
    
    res.status(401).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

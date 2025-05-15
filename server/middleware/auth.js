const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'Nevažeći token!' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Potrebna je prijava!' });
  }
};

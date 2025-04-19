require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./models/db');

connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"] // Dodaj DELETE
}));
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api', adminRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'API radi!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server radi na portu ${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const dotenv = require('dotenv');
const path = require('path'); // Import the 'path' module

dotenv.config()

// Обработка запросов
const app = express();
app.use(express.json())

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

// Route for the root path '/'
app.get('/', (req,res) =>
{
  res.sendFile(path.join(__dirname, 'index.html')); // Send the 'index.html' file as a response
})

// Connect to MongoDB using the MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Сервер запущен на порте: ${port}`);
});

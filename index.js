const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const dotenv = require('dotenv');

dotenv.config()

// Обработка запросов
const app = express();
app.use(express.json())
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Сервер запущен на порте: ${port}`);
  });
  
app.get('/', (req, res) => {
    res.send('Hello World!');
  });


mongoose.connect("mongodb://localhost:27017/mini-database", { useNewUrlParser: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

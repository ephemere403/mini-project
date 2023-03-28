
const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const app = express();
const flash = require('connect-flash');

dotenv.config()


// Start the server

// middleware 
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// Set the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view options', { include: true });

// Set up flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// db800
const MongoURI = process.env.MONGODB_URI || 'mongodb://localhost:'+port+'/mydatabase'
mongoose.connect(MongoURI, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected to ' + MongoURI))
  .catch(err => console.log(err));

// Configure routes
app.use('/', require('./routes/index'));
app.use('/publications', require('./routes/publications'));
app.use('/users', require('./routes/users'));
app.use('/account', require('./routes/account'));


port = parseInt(process.env.PORT, 10) || 3000;
const server = app.listen(port, () => console.log('Server started on port ' + port));
const socket = require('./socket');
socket.init(server);

module.exports = app;  
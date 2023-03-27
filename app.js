const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const dotenv = require('dotenv')
const User = require('./models/User');
const flash = require('connect-flash');
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config()

const app = express();

// Start the server
port = parseInt(process.env.PORT, 10) || 3000
app.listen(port, () => console.log('Server started on port '+port));

// middleware 
app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Set the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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

// Configure passport
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'Email not registered' });
    }
    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      return done(null, false, { message: 'Invalid password' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

// Configure routes
app.use('/', require('./routes/index'));
app.use('/publications', require('./routes/publications'));
app.use('/users', require('./routes/users'));


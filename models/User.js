const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let User;

try {
  User = mongoose.model('User');
} catch {
  const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  });

  UserSchema.methods.isValidPassword = async function(password) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (err) {
      throw err;
    }
  };

  User = mongoose.model('User', UserSchema);
}

module.exports = User;

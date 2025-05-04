
const mongoose = require('mongoose');

const loginDataSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
}, {
  timestamps: true
});

const LoginData = mongoose.model('LoginData', loginDataSchema);
module.exports = LoginData ;// 👈 Your collection name

// Mongoose isko automatically:
// lowercase karega: user
// pluralize karega: users (jo actual me mera table/collection name hai)


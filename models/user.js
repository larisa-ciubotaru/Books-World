const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const mongooseBcrypt = require('mongoose-bcrypt');

const userSchema = new mongoose.Schema({
    first_name: {
      type: String,
      required: 'Numele de familie este necesar',
      trim: true,
      max: 30
    },
    surname: {
      type: String,
      required: 'Prenumele este necesar',
      trim: true,
      max: 30
    },
    email: {
      type: String,
      required: 'Emailul este necesar',
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: 'Parola este necesara',
      bcrypt: true
    },

    credit: {
      type: Number
    },

    noExchangedBooks: {
      type: Number
    },

    noSoldBooks: {
      type: Number
    }
    // image: String,
    // descriere: String
  });

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongooseBcrypt);

module.exports = mongoose.model('User', userSchema);
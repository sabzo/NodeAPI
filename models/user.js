const mongoose = require('mongoose');


var mongoDBUri = process.env.MONGODB_LOCAL_URI;
console.log('mongo: ' + mongoDBUri.toString());

const schema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  }, 
  { timestamps: true
});

module.exports = mongoose.model('User', schema);
   

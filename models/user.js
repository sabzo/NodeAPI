const mongoose = require('mongoose');
const jwt  = require('jsonwebtoken')

var mongoDBUri = process.env.MONGODB_PROD_URI || process.env.MONGODB_LOCAL_URI;

console.log('mongo: ' + mongoDBUri.toString());

const schema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: {type:String, required: true},
  token: String,
  inviteID: String,
  invited: Boolean,
  }, 
  { timestamps: true
});

schema.methods.newAuthToken = async function() {
    const user  = this
    const token =  jwt.sign({ _id: user.id.toString() }, process.env.JWTSECRET, {expiresIn: "14d"})
    user.token = token;
    await user.save()
    return token
}

schema.methods.getProfile = function() {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
  };
}

module.exports = mongoose.model('User', schema, 'users');

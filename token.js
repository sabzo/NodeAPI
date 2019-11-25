const jwt  = require('jsonwebtoken')
const User = require('./models/user');

module.exports = async function(token) {
  var decoded = jwt.decode(token, {complete: true});
  if (decoded) {
    console.log(decoded.header);
    console.log(decoded.payload)
  }
  // is token still valid?
  try {
    jwt.verify(token, process.env.JWTSECRET, function(err, decoded){
      if(err) { 
         console.log(err);  
         throw err;
      }
    });
    // does token belong to a user?
    var u = await User.findOne({token: token}).exec(); 
    return (u.token == token) ? u.id : false;
  } catch(e) {
    console.log('Error', e);
    return false;
  }
}

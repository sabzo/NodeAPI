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
    jwt.verify(token, 'a-secret', function(err, decoded){
      if(err) { 
         console.log(err);  
         return false;
      }
    });
    // does token belong to user?
    var u = await User.findOne({token: token}).exec();
    console.log(u);
    return (u.token == token); 
  } catch(e) {
    console.log(e);
    return false;
  }
}

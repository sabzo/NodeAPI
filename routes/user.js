const express = require('express');
const router = new express.Router();
const bcrypt = require('bcrypt')
const User = require('../models/user');
const verifyToken = require('../token.js');
const { check, validationResult } = require('express-validator');
const shortid = require('shortid');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function getToken(req) {
  return req == undefined || req.replace('Bearer ', '');
}

router.get('/user/:id', async (req, res) => {
  const token = getToken(req.headers.authorization);
  // is this an authenticated request
  var authenticated = await verifyToken(token); 
  if (authenticated) {
    User.findOne({_id: req.params.id}, function(err, user) {
      if(err) {
        return res.status(404).send({message: 'user not found'});  
      } else { 
        return res.status(200).send(user.getProfile());
      }
    }); 
  } else {
    return res.status(401).send({message: 'unauthorized'}); 
  }
});

router.get('/users', async (req, res) => {
  const token = getToken(req.headers.authorization);
  var authenticated = await verifyToken(token); 
  //console.log('authenticated', authenticated);
  if (authenticated) {
  User.find({}, 'id firstName lastName', function(err, users) {
      if(err) {
        return res.status(404).send({message: 'user not found'});  
      } else { 
        result = [];
        users.forEach(function(u) {
          result.push(u.getProfile());  
        });
        return res.status(200).send(result);
      }
    }); 
  } else {
    return res.status(401).send({message: 'unauthorized'}); 
  }
});

router.post('/user', [ 
   check('firstName').exists(),
   check('lastName').exists(),
   check('password').exists()
  ], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  var exists = await User.findOne({ email: req.body.email}).exec(); 
  if (exists) return res.status(400).send({message : "That email exists"});

  var user = new User(req.body);
  user.save(function (err, u) {
    if (err) return console.log(err);
    // console.log(u);
    res.send({ok: 200});
  });
});

router.post("/user/login", async (req, res) => {
    try {
        var user = await User.findOne({ email: req.body.email}).exec();
        if(!user) {
            return res.status(400).send({ message: "The email does not exist" });
        }
        const token = await user.newAuthToken();       
        if(await bcrypt.compare(req.body.password, user.password)) {
            return res.status(200).send({ message: "success",
            token: token});
        }
        else return res.status(401).send({message: "unauthorized"});
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
 
});

// logs a user out
router.post("/user/logout", async (req, res) => {
  const token = getToken(req.headers.authorization);    
  var authenticated = await verifyToken(token); 
  if (authenticated) {
    // delete token  
    user = User.updateOne({token: token}, {token: null}, function(err, u) {
      if (err) {
        return res.status(422).send({message: 'error'});
      } else if (u) {
        return res.status(200).send();
      } else {
        return res.status(404).send({message: 'invalid token'});
      } 
    }); 
  } else {
    return res.status(422).send({message: 'invalid token'});
  } 
});

router.post("/user/invite", [
  check('email').isEmail(),
  check('firstName').exists(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const token = getToken(req.headers.authorization);    
  var authenticated = await verifyToken(token); 
  if (authenticated) {
    // check if user account already exists or if user has been invited
    User.findOne({email: req.body.email}, function(err, user) {
      if (err) {
        console.log(err);
        return res.status(400).send({ message: "unable to find user" }); 
      } else {
      // if email invite has been sent
        if (!user) {
					const companyName = process.env.COMPANY_NAME;
					const inviteID = shortid.generate();
					const text = 'Hi ' + req.body.firstName + '!: Click <a href="' + 
					process.env.HOST + '?inviteID=' + inviteID + '"> here </a> to activate  your ' +  companyName + ' account';
					const msg = {
						to: req.body.email,
						from: process.env.SENDGRID_EMAIL_ADDRESS,
						subject: companyName + ': Active your account',
						text: text,
						html: text
					};
					const randomPassword = shortid.generate();
					sgMail.send(msg).then(() => {
						user = new User({email: req.body.email, inviteID: inviteID, password: randomPassword});
						user.save(); 
						return res.status(200).send();
	        })
					.catch(err => {
						 console.error(err.toString());
            console.log(message, code, response);
            return res.status(400).send({message: "Unable to invite user"});
					});
        } else {
          return res.status(400).send({ message: "Email already invited or exists" }); 
        }
      }
    }); 
  } else {
    return res.status(401).send({message: 'unauthorized'}); 
  }
});

router.post("/user/from_invite", [
  check('email').isEmail(),
  check('inviteID').isLength({ min: 7 }),
  check('firstName').exists(),
  check('lastName').exists(),
  check('password').exists(),
  check('inviteID').exists()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const inviteID = req.body.inviteID;
  const email = req.body.email;

  user = User.findOne({inviteID: inviteID, email: email}, function(err, u) {
    if (err || !u) {
       return res.status(404).send({message: 'Invalid invite link'});  
     } else { 
       // update user
       u.firstName = req.body.firstName;
       u.lastName = req.body.lastName;
       u.password = req.body.password;
       u.inviteID = null;
       u.invited = true;
       u.save();
       return res.status(200).send();
     }
  });
});

module.exports = router

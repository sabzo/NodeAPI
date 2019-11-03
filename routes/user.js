const express = require('express');
const router = new express.Router();
const bcrypt = require('bcrypt')
const User = require('../models/user');
const verifyToken = require('../token.js');

function getToken(req) {
 return req.replace('Bearer ', '')
}

router.get('/user/:id', async (req, res) => {
  const token = getToken(req.headers.authorization);
  console.log('token is: ' + token);
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

router.get('/user/all', (req, res) => {
  User.find(function(err, users) {
    console.log(users);  
  });
  res.json({ok: 200});  
});

router.post('/user', async (req, res) => {
  console.log(req);
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  var exists = await User.findOne({ email: req.body.email}).exec(); 
  if (exists) return res.status(400).send({message : "That email exists"});

  var user = new User(req.body);
  user.save(function (err, u) {
    if (err) return console.log(err);
    console.log(u);
    res.send({ok: 200});
  });
});

router.post("/user/login", async (req, res) => {
    try {
        var user = await User.findOne({ email: req.body.email}).exec();
        if(!user) {
            return res.status(400).send({ message: "The email does not exist" });
        }
        console.log(user);
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

module.exports = router


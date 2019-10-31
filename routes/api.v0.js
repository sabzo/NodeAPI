const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')

//const initializePassport = require('../passport-config');
const User = require('../models/user');

router.use(require('./user'));
router.use(require('./film'));

router.get('/', function(req, res) {
  res.json({'success': true});
});


module.exports = router;

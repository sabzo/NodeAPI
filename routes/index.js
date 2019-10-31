const express = require('express');
const router = express.Router();

router.use('/api', require('./api.v0.js'));

module.exports = router;

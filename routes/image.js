const express = require('express');
const router = new express.Router();
const bcrypt = require('bcrypt')
const aws = require('aws-sdk');
const verifyToken = require('../token.js');
const { check, validationResult } = require('express-validator');
const shortid = require('shortid');
const helpers = require('../lib/helpers.js');

// AWS setup
aws.config.region = process.env.AWS_REGION;
const S3_BUCKET = process.env.S3_BUCKET;

// Get image by its id
router.get('/img/i/:id', (req, res) => {
  res.status(200).send();  
});

/* Sign an image for s3 upload 
ref: https://devcenter.heroku.com/articles/s3-upload-node */
router.get('/img/s3_sign', [
  check('file-type').exists()
  ], async (req, res) => {
  // validate results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // make sure user is logged in
  const token = helpers.getToken(req.headers.authorization);
  var authenticatedUserID = await verifyToken(token);
  if (authenticatedUserID) {
	  const s3 = new aws.S3();
	  //TODO Let filename be user + randomid
	  const fileName = authenticatedUserID + Date.now() + shortid.generate();
	  const fileType = req.query['file-type'];
	  const s3Params = {
	    Bucket: S3_BUCKET,
	    Key: fileName,
	    Expires: 60,
	    ContentType: fileType,
	    ACL: 'public-read'
	  };

	  s3.getSignedUrl('putObject', s3Params, (err, data) => {
	    if(err){
	      console.log(err);
	      return res.end();
	    }
	    const returnData = {
	      signedRequest: data,
	      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
	    };
	    res.write(JSON.stringify(returnData));
	    res.end();
	  });
  } else {
    return res.status(401).send({message: 'unauthorized'}); 
  }
});

// Get images by user
router.get('/img/user', (req, res) => {
});

/* Save image details */
router.post('/save-details', (req, res) => {
  //TODO Save filename under user DB 
  // TODO New mongoose model for image
});

module.exports = router

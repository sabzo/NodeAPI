const express = require('express');
const router = new express.Router();
const bcrypt = require('bcrypt')
const aws = require('aws-sdk');
const verifyToken = require('../token.js');
const { check, validationResult } = require('express-validator');
const shortid = require('shortid');

// AWS setup
aws.config.region = process.env.AWS_REGION;
const S3_BUCKET = process.env.S3_BUCKET;

// Get image by its id
router.get('/image/i/:id', (req, res) => {
  
});

/* Sign an image for s3 upload 
ref: https://devcenter.heroku.com/articles/s3-upload-node */
router.get('/image/s3_sign', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
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
});

// Get images by user
router.get('/images/user', (req, res) => {
});

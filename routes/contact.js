const express = require('express');
const router = new express.Router();
const { check, validationResult } = require('express-validator');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

console.log('email key: ' + process.env.SENDGRID_API_KEY);
router.post("/contact_us/", [
  check('email').isEmail(),
  check('name').exists(),
  check('message').exists()
  ], (req, res) => {
    const msg = {
      to: process.env.SENDGRID_EMAIL_ADDRESS,
      from: req.body.email,
      subject: 'contact request',
      text: req.body.message
    };
    console.log(msg);
    sgMail.send(msg).then(() => {
      return res.status(200).send();
    }).catch((error) => {
	return res.status(400).send(error);
    });
    return;
});

module.exports = router

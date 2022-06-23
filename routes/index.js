const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { check, validationResult } = require('express-validator')
const Models = require('../models/Models')
// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);



// Navigation
router.get('', (req, res)=> {
  res.render('index')
})

router.get('/report', (req, res)=> {
  res.render('report')
})

router.post('/report', [
  check('firstname', 'This first name must me 3+ characters long')
      .exists()
      .isLength({ min: 3 }),
  check('email', 'Email is not valid')
      .isEmail()
      .normalizeEmail()
], async (req, res)=> {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
      // return res.status(422).jsonp(errors.array())
      const alert = errors.array();
      res.render('report', {
          alert
      });
  }
  else
  {//save report to db, and send emails 
    console.log(req.body);
    if(req.body.latitude && req.body.longitude)
    {
        let report = await Models.report.findOne({latitude:req.body.latitude, longitude:req.body.logitude});
        if(!report)
          report = await new Models.report({gpsLocation:{latitude: req.body.latitude, longitude: req.body.longitude},
        email: req.body.email,
        questions:[ 
            {questionText:"Do you feel the effects of gas?", answerText:req.body.question1Answer},
            {questionText:"Do you smell gas?", answerText:req.body.question2Answer},
            {questionText:"Are you reporting from the location, about a gerneral vacinity or manually entering the address?", answerText:req.body.question3Answer}
        ]});
        console.log("hello report successful!", report);
    }
    res.render('report');
  }
})
module.exports = router;


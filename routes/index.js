var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/test');
var Schema = mongoose.Schema;
require('mongoose-type-email');
var validator = require("email-validator");
 

var userDataSchema = new Schema({
  emails: {type: mongoose.SchemaTypes.Email, required: true},
  creatdate: { type: Date, default: Date.now },
}, {collection: 'user-data'});

var UserData = mongoose.model('UserData', userDataSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/box', function(req, res, next) {
  res.render('template.html');
});

router.get('/get-data', function(req, res, next) {
  UserData.find()
      .then(function(doc) {
        console.log(doc)
        res.render('email', {items: doc});
      });
});

router.post('/insert', function(req, res, next) {
  if (validator.validate(req.body.email)) {
    var item = {
      emails: req.body.email
    };
  
    var data = new UserData(item);
    data.save((err) => {
      if (err) {
        console.log(err.emails)
        res.render('index', {err: 'email invalid'});
      }else{
        res.redirect('/');
  
      }
    });
    
  } else {
    res.render('index', {err: 'email invalid'});
  }
  

  
});

router.post('/update', function(req, res, next) {
  var id = req.body.id;

  UserData.findById(id, function(err, doc) {
    if (err) {
      console.error('error, no entry found');
    }
    doc.emails = req.body.email;
    
    doc.save();
  })
  res.redirect('/');
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;
  UserData.findByIdAndRemove(id).exec();
  res.redirect('/');
});

module.exports = router;

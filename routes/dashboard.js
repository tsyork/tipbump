var express = require('express');
var router = express.Router();
var extend = require('xtend');
var request = require('request');
// var stormpath = require('express-stormpath');


/* GET dashboard page. */
router.get('/', function(req, res, locals) {

  var tableauUser = 'jcarlson@qbixanalytics.com';
  request.post({url:'http://70.35.194.136:9002/api/tickets', form:{email:tableauUser}}, function optionalCallback(err, httpResponse, body) {
      if (err) {
          return console.error('upload failed:', err);
      }

      //var ticketValue = body ;
      console.log(body);
      console.log('rendering form');

      res.render('dashboard', extend({
          title: 'Dashboard',
          // user: req.user,
          ticket: body
      },locals||{}));

      // res.render('dashboard', {title: 'Dashboard'});
  });
});

// // Render the dashboard page.
// router.get('/', stormpath.getUser, function (req, res, locals) {
//   console.log('email');
//   console.log(req.user.email);
//   if (!req.user || req.user.status !== 'ENABLED') {
//     return res.redirect('/login');
//   }
//
//   var tableauUser = req.user.email;
//   console.log(req.user);
//   console.log(req.user.customData.isAdministrator);
//
//   request.post({url:'http://70.35.194.136:9001/api/tickets', form:{email:tableauUser}}, function optionalCallback(err, httpResponse, body) {
//     if (err) {
//       return console.error('upload failed:', err);
//     }
//
//     //var ticketValue = body ;
//     console.log(body);
//     console.log('rendering form');
//
//     res.render('dashboard', extend({
//       title: 'My dashboard',
//       user: req.user,
//       ticket: body
//     },locals||{}));
//
//   });
//
// });

module.exports = router;
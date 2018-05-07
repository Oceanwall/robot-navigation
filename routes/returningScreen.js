'use strict';
const IP_V4 = "http://localhost:3000";

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  // //meant to ensure that people can't arbitraily access returning page, mess up cycle
  // let referrer = req.get("Referrer");
  // console.log(referrer);
  // if (referrer == IP_V4 + '/' || referrer == IP_V4 + '/eventSelector') {
  //   res.render('loadingScreen');
  // }
  // else res.status(403).send("403 ERROR: You should not be directly accessing this page.");

  res.render('returningScreen');
});

module.exports = router;

'use strict';
const IP_V4 = "http://10.148.183.240:3000/";

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  //meant to ensure that people can't arbitraily access loading page, send thousands of fetch requests
  let referrer = req.get("Referrer");
  console.log(referrer);
  if (referrer == IP_V4) {
    res.render('loadingScreen');
  }
  else res.status(403).send("403 ERROR: You should not be directly accessing this page.");
});

module.exports = router;

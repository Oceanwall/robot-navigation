'use strict';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const ROSLIB = require("roslib")

var index = require('./routes/index');
var requestRobot = require('./routes/requestRobot');

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/eventSelector', index);
app.use('/', requestRobot);

//TODO: create ros subscriber node for feedback to user?

/*
//presume that the rosbridge server is on localhost, default port 9090
//TODO: change localhost to IPv4 constant?
var ros = new ROSLIB.Ros({
  url: 'ws://localhost:9090'
});

ros.on('connection', function() {
 console.log('Connected to websocket server.');
});

ros.on('error', function(error) {
 console.log('Error connecting to websocket server: ', error);
});

ros.on('close', function() {
 console.log('Connection to websocket server closed.');
});

//topic publishing
//create the topic
var roomNumber = new ROSLIB.Topic({
	ros: ros,
	name: '/roomNumber',
	messageType: 'std_msgs/String',
});
*/

//get room number of event to navigate to
app.post('/sendRoomNumber', function(req, res) {
	let keys = Object.keys(req.body);
	let number = keys[0];
	console.log(number);
	// let message = new ROSLIB.Message({
	// 	data: number,
	// });
	// roomNumber.publish(message);
	res.status(200).send("success");
});

//get room number of user to navigate to
//TODO: different publishers? consider...
app.post('/userCurrentLocation', function(req, res) {
	let keys = Object.keys(req.body);
	let number = keys[0];
	console.log(number);
	// let message = new ROSLIB.Message({
	// 	data: number,
	// });
	// roomNumber.publish(message);
	res.status(200).send("success");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

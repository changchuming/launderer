//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
// Express.io, combination of express and socket.io
var express = require('express.io'); 
var app = module.exports = express();
app.http().io();
// Serve-favicon, module to display favicon
var favicon = require('serve-favicon'); 
app.use(favicon(__dirname + '/public/img/favicon.ico'));
// Standard stuff
var bodyParser = require("body-parser");
app.configure(function(){
	  app.use(bodyParser.json());
	  app.use(bodyParser.urlencoded({ extended: true }));
	  app.use(app.router);
	});
var http = require('http');
var path = require('path');
var util = require("util");

//----------------------------------------------------------------------------------------------
// Queue
//----------------------------------------------------------------------------------------------
var queue = require('./modules/queue');
queue.initialize();
queue.process();

//----------------------------------------------------------------------------------------------
// Routes
//----------------------------------------------------------------------------------------------
var index = require('./routes');
var result = require('./routes/result');
var drone = require('./routes/drone');

//----------------------------------------------------------------------------------------------
// Express - All environments
//----------------------------------------------------------------------------------------------
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//----------------------------------------------------------------------------------------------
// Development only
//----------------------------------------------------------------------------------------------

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//----------------------------------------------------------------------------------------------
// Error handling if we are unable to connect to redis
//----------------------------------------------------------------------------------------------

redisClient.on("error", function (err) {
	console.log("Redis server cannot be reached.");
	});

//----------------------------------------------------------------------------------------------
// Create server and listen to port
//----------------------------------------------------------------------------------------------

app.listen(app.get('port'), function(){
   console.log("Express server listening on port " + app.get('port'));
});

//----------------------------------------------------------------------------------------------
// Socket routes
//----------------------------------------------------------------------------------------------

//Joins a room
app.io.route('join', function(req) {
    req.io.join(req.data);
});

// Leaves a room
app.io.route('leave', function(req) {
    req.io.leave(req.data);
});

// Special case when pi connects
app.io.route('pijoin', function(req) {
    drone.pijoin(req);
});

// Set new job with iid for pi
app.io.route('pinewjob', function(req) {
    drone.newjob(req);
});

// Asks a certain pi to take a picture
app.io.route('pitakepic', function(req) {
    drone.takepic(req);
});

// Asks a certain pi to add a picture
app.io.route('piaddpic', function(req) {
    drone.addpic(req);
});

// Remove picture from database
app.io.route('piremovepic', function(req) {
    drone.removepic(req);
});

// Remove picture from database
app.io.route('piprocessjob', function(req) {
    drone.processjob(req);
});

// Halt / shutdown a pi
app.io.route('pihalt', function (req) {
	drone.pihalt(req);
});

// Show connected pi's ip
app.io.route('piip', function(req) {
    console.log(req.data);
});

// Upload pics
app.io.route('uploadpic', function(req) {
    index.uploadpic(req);
});

//Remove picture from database
app.io.route('removepic', function(req) {
    index.removepic(req);
});

//Remove picture from database
app.io.route('processjob', function(req) {
    index.processjob(req);
});

//##############################################################################################
// Display landing page
//##############################################################################################
app.get('/', index.display);

//##############################################################################################
// Logic to upload photos
//##############################################################################################
app.post('/upload', index.upload);

//##############################################################################################
// Display pi landing page
//##############################################################################################
app.get('/drone', drone.display);

//##############################################################################################
//Render about page
//##############################################################################################
app.get('/about', index.about);

//##############################################################################################
// Display result of run
//##############################################################################################
app.get('/:jobid', result.display);

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
// Routes
//----------------------------------------------------------------------------------------------
var index = require('./routes');

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
// Create server and listen to port
//----------------------------------------------------------------------------------------------

app.listen(app.get('port'), function(){
   console.log("Express server listening on port " + app.get('port'));
});

//----------------------------------------------------------------------------------------------
// Socket routes
//----------------------------------------------------------------------------------------------

// //Joins a room
// app.io.route('join', function(req) {
//     req.io.join(req.data);
// });

//##############################################################################################
// Display landing page
//##############################################################################################
app.get('/', index.display);
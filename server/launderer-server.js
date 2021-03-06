//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
// Express
var express = require('express');
var app = express();

// Middleware
var favicon = require('serve-favicon'); 
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var static = require('serve-static');
var errorHandler = require('errorhandler');
var cors = require('cors');

// Standard stuff	  
var http = require('http');
var path = require('path');
var fs = require('fs');
var util = require("util");

//----------------------------------------------------------------------------------------------
// Modules
//----------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------
// Routes
//----------------------------------------------------------------------------------------------
var index = require('./routes');

//----------------------------------------------------------------------------------------------
// Express - All environments
//----------------------------------------------------------------------------------------------
var port = process.env.PORT || 3000;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(methodOverride('_method'));
app.use(static(__dirname + '/public'));
app.use(cors());

//----------------------------------------------------------------------------------------------
// Development only
//----------------------------------------------------------------------------------------------

if ('development' == app.get('env')) {
  app.use(errorHandler());
}

//----------------------------------------------------------------------------------------------
// Connect to database and tropo (for sms)
//----------------------------------------------------------------------------------------------
var database = require('./modules/database').connect('launderer');

// Overload log function to write to file
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
	log_file.write(util.format(d) + '\n');
	log_stdout.write(util.format(d) + '\n');
};

//----------------------------------------------------------------------------------------------
// Create server and listen to port
//----------------------------------------------------------------------------------------------

app.listen(port, function(){
   console.log("Express server listening on port " + port);
});

//----------------------------------------------------------------------------------------------
// Socket routes
//----------------------------------------------------------------------------------------------

// //Joins a room
// app.io.route('join', function(req) {
//     req.io.join(req.data);
// });

//##############################################################################################
// Define router
//##############################################################################################

var router = express.Router();

app.use('/', router);

router.get('/', index.display);

router.get('/about', index.about);

router.post('/checkuser', index.checkUser);

router.post('/adduser', index.addUser);

router.post('/addmachine', index.addMachine);

router.post('/getmachineusage', index.getMachineUsage);

router.post('/setmachineusage', index.setMachineUsage);

router.post('/clearmachineusage', index.clearMachineUsage);

router.post('/getallclusters', index.getAllClusters);

router.post('/addcluster', index.addCluster);
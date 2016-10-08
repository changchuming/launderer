
/*
 * GET home page.
 */
 
//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
 
var moment = require('moment');
var database = require('../modules/database');
var sms = require('../modules/sms');
var jobTimers = {};
var jobTimeStart = {};
var timeout = {Washer: 2100000, Dryer: 1800000, Coin: Number.MAX_VALUE};

//##############################################################################################
// Display home page
//##############################################################################################
exports.display = function(req, res){
  	// commenting out the main index page
  	res.render('index', {
  		title: 'Launderer',
  	});
  	var message = 'hi';
  	// var message = 'Your laundry is done on ' + moment().format("h:mm:ss a, dddd, MMMM Do YYYY" + '.');
	sms.sendSMS(message, '+6590437467', function(err, message) {
		if (err || !user) {
			if (err)
				console.log(err);
			res.send(false);
		} else {
			console.log(message.sid);
		}
	});
};

//##############################################################################################
// Display about page
//##############################################################################################
exports.about = function(req, res){
	res.render('about');
};

//##############################################################################################
// Checks whether user is in database
//##############################################################################################
exports.checkUser = function(req, res) {
	database.getUserField(req.body.id, 'name', function (err, user){
		if (err || !user) {
			if (err)
				console.log(err);
			res.send(false);
		}
		else if (!user) {
			res.send(false);
		} else {
			res.send(true);
		}
	});
}

//##############################################################################################
// Add user to database
//##############################################################################################
exports.addUser = function(req, res) {
	database.newUser(req.body.id, req.body.name, req.body.number, function (err) {
		if (err) {
			console.log(err);
			res.send(false);
		} else {
			res.send(true);
		}
	});
}

//##############################################################################################
// Get all collections of machines
//##############################################################################################
exports.getAllClusters = function(req, res) {
	database.getAllClusters(function (err, clusters) {
		if (err || !clusters) {
			if (err)
				console.log(err);
			res.send(false); 
		} else {
			res.send(clusters);
		}
	});
}

//##############################################################################################
// Adds a collection of machines
//##############################################################################################
exports.addCluster = function(req, res) {
	database.newCluster(req.body.name, function(err, cluster, result) {
		if (err || !result) {
			if (err)
				console.log(err);
			res.send(false);
		}
		else {
			res.send(true);
		}
	});
}

//##############################################################################################
// Add machine to database
//##############################################################################################
exports.addMachine = function(req, res) {
	database.newMachine(req.body.clustername, req.body.type, function (err) {
		if (err) {
			console.log(err);
			res.send(false);
		} else {
			res.send(true);
		}
	});
}

//##############################################################################################
// Set last user of machine
//##############################################################################################
exports.setMachineUsage = function(req, res) {
	database.upsertMachineField(req.body.clustername, req.body.index, 'userid', req.body.userid, function(err, cluster) {
		console.log(req.body.clustername+req.body.index);
		if (err || !cluster) {
			if (err)
				console.log(err);
			res.send(false);
		}
		else {
			console.log(cluster);
			var timestart = Date.now();
			if (!jobTimers[req.body.clustername])
				jobTimers[req.body.clustername] = [];
			var type = cluster.machines[req.body.index].type;
			
			// Set new job timer
			clearTimeout(jobTimers[req.body.clustername][req.body.index]);
			jobTimers[req.body.clustername][req.body.index] = setTimeout(alertMachineUser, timeout[type], req.body.clustername, req.body.index);
			
			// Save starting time
			if (!jobTimeStart[req.body.clustername])
				jobTimeStart[req.body.clustername] = [];
			jobTimeStart[req.body.clustername][req.body.index] = timestart;
			res.send(true);
		}
	});
}

//##############################################################################################
// Clear machine timer
//##############################################################################################
exports.clearMachineUsage = function(req, res) {
	database.upsertMachineField(req.body.clustername, req.body.index, 'userid', '00000000');
	clearTimeout(jobTimers[req.body.clustername][req.body.index]);
}


//##############################################################################################
// Get machine usage
//##############################################################################################
exports.getMachineUsage = function(req, res) {
	database.getMachine(req.body.clustername, req.body.index, function(err, machine) {
		if (err || !machine) {
			if (err)
				console.log(err);
			res.send(false);
		}
		else {
			var userid = machine.userid;
			database.getUserField(machine.userid, 'name', function (err, user){
				if (err || !user) {
					res.send(false);
					if (err)
						console.log(err);
				} else {
					if (jobTimeStart[req.body.clustername]) {
						var timeleft = jobTimeStart[req.body.clustername][req.body.index]+timeout[machine.type]
										- Date.now();
						res.send({username: user.name, timeleft: timeleft, timeout: timeout[machine.type]});
					} else {
						res.send({username: user.name, timeleft: 0, timeout: timeout[machine.type]});
					}
				}
			});
		}
	});
}

//##############################################################################################
// Alerts user when timer is up
//##############################################################################################
var alertMachineUser = function(clustername, index) {
	console.log('Alert user!');
	database.getMachine(clustername, index, function(err, machine) {
		if (err) {
			console.log(err);
		} else if (machine.userid && machine.userid != '00000000') {
		  	var message = 'Your laundry is done on ' + moment().format("h:mm:ss a, dddd, MMMM Do YYYY" + '.');
			database.getUserField(req.body.id, 'number', function (err, user){
				if (err || !user) {
					if (err)
						console.log(err);
				} else {
				  	// var message = 'Your laundry is done on ' + moment().format("h:mm:ss a, dddd, MMMM Do YYYY" + '.');
					sms.sendSMS(message, user.number, function(err, message) {
						if (err || !user) {
							if (err)
								console.log(err);
						} else {
							console.log(message.sid);
						}
					});
				}
			});
		}
	});
}
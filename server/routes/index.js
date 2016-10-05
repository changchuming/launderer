
/*
 * GET home page.
 */
 
//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
 
var database = require('../modules/database');
var jobTimers = {};
var timeout = {washer: 2100000, dryer: 1800000, coin: Number.MAX_VALUE};

//##############################################################################################
// Display home page
//##############################################################################################
exports.display = function(req, res){
  	// commenting out the main index page
  	res.render('index', {
  		title: 'Launderer',
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
		if (err) {
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
// Add machine to database
//##############################################################################################
exports.addMachine = function(req, res) {
	database.newMachine(req.body.id, req.body.type, '00000000', function (err) {
		if (err) {
			console.log(err);
			res.send(false);
		} else {
			res.send(true);
		}
	});
}

//##############################################################################################
// Get last user of machine
//##############################################################################################
exports.getMachineUsage = function(req, res) {
	database.getMachineField(req.body.id, 'userid', function (err, machine) {
		if (err || !machine) {
			if (err)
				console.log(err);
			database.newUser('00000000', 'None', '00000000');
			database.upsertMachineField(req.body.id, 'userid', '00000000');
			res.send('None');
		}
		else {
			database.getUserField(machine.userid, 'name', function (err, user){
				if (err || !user) {
					if (err)
						console.log(err);
					res.send('None');
				} else {
					res.send(user.name);
				}
			});
		}
	});
}

//##############################################################################################
// Set last user of machine
//##############################################################################################
exports.setMachineUsage = function(req, res) {
	database.upsertMachineField(req.body.id, 'userid', req.body.userid, function(err,result) {
		if (err)
			console.log(err);
	});
	database.getMachineField(req.body.id, 'type', function (err, machine) {
		jobTimers[req.body.id] = setTimeout(alertMachineUser, timeout[machine.type], req.body.id);
	});
}

//##############################################################################################
// Clear machine timer
//##############################################################################################
exports.clearMachineUsage = function(req, res) {
	database.upsertMachineField(req.body.id, 'userid', '00000000');
	clearTimeout(jobTimers[req.body.id]);
}

//##############################################################################################
// Get all collections of machines
//##############################################################################################
exports.getAllClusters = function(req, res) {
	database.getAllClusters(function (err, clusters) {
		if (err || !clusters) {
			if (err)
				console.log(err);
			res.send('No clusters!'); 
		} else {
			res.send(clusters);
		}
	});
}

//##############################################################################################
// Adds a collection of machines
//##############################################################################################
exports.addCluster = function(req, res) {
	database.upsertClusterField(req.body.id, 'number', req.body.number, function(err,result) {
		if (err)
			console.log(err);
		console.log(result);
	});
}

//##############################################################################################
// Alerts user when timer is up
//##############################################################################################
var alertMachineUser = function(id) {
	console.log('Alert user!');
	database.getMachineField(id, 'userid', function(err, machine) {
		if (err) {
			console.log(err);
		} else if (machine.userid && machine.userid != '00000000') {
			// Alert user
		}
	});
}
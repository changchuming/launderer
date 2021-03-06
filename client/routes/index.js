
/*
 * GET home page.
 */
 
//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
 
var moment = require('moment');
var timeout = {Washer: 2100000, Dryer: 1800000, Coin: Number.MAX_VALUE};
var util = require('util')
var exec = require('child_process').exec;
var child;

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

exports.getuserid = function(req, res) {
	// executes `pwd`
	child = exec("nfc-list | grep UID", function (error, stdout, stderr) {
	    if (error !== null) {
	    	console.log('exec error: ' + error);
	    	res.send(false);
	  	} else {
		    var uid = stdout.substring(stdout.indexOf(':')+2, stdout.indexOf(':')+23);
	    	uid = uid.replace(/\s+/g, "");
	    	if (uid != '')
	  			res.send(uid);
	  		else
	  			res.send(false);
	  	}
	});
}
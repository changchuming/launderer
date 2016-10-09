var http = require('http');
var util = require('util');
var auth = require('./auth');

// Twilio Credentials 
var accountSid = 'ACd0941deb202eb22817b7c9120a05e407'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, auth.authToken); 

exports.sendSMS = function(message, number, callback) {
	client.messages.create({
	  from: "Launderer",
	  to:   number,
	  body: message
	}, callback);
}
var http = require('http');
var util = require('util');

// Twilio Credentials 
var accountSid = 'ACd0941deb202eb22817b7c9120a05e407'; 
var authToken = '4932978cef50d1ecdf60bf2345806245'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 

exports.sendSMS = function(message, number, callback) {
	client.messages.create({
	  from: "Launderer",
	  to:   number,
	  body: message
	}, callback);
}
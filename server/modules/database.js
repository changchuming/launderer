//----------------------------------------------------------------------------------------------
// Mongoose
//----------------------------------------------------------------------------------------------
var mongoose = require('mongoose');
var moment = require('moment');

// User definition
var userSchema = new mongoose.Schema({ 
	id: {type: String, unique : true, required : true, dropDups: true }, 
	name: {type: String, required : true }, 
	number: {type: String}
});
var User = mongoose.model('User', userSchema);

// Machine definition
var machineSchema = new mongoose.Schema({
	type: {type: String, required : true },
	timeout: {type: Number, required: true},
	userid: {type: String, required : true }
});
var Machine = mongoose.model('Machine', machineSchema);

// Cluster definition
var clusterSchema = new mongoose.Schema({
	name: {type: String, unique : true, required : true, dropDups: true }, 
	machines: [machineSchema]
});
var Cluster = mongoose.model('Cluster', clusterSchema);

// Log definition
var logSchema = new mongoose.Schema({
	action: {type: String, required: true},
	time: {type: String, required: true},
	parameters: []
});
var Log = mongoose.model('Log', logSchema);

exports.connect = function(database) {
	dbLog('connect', {database: database});
	mongoose.connect('mongodb://localhost/' + database);
}

exports.newUser = function(id, name, number, callback) {
	dbLog('newuser', {id: id, name: name, number: number});
	var newUser = new User({ id: id, name: name, number: number});

	newUser.save(callback);
}

exports.getUserField = function(id, field, callback) {
	dbLog('getUserField', {id: id, field: field});
	User.findOne({ id: id }, field, callback);
}

exports.upsertUserField = function(id, field, data, callback) {
	dbLog('upsertuserfield', {id: id, field: field, data: data});
	User.findOneAndUpdate({id: id}, { $set: {[field]: data}}, {upsert:true}, callback);
};

exports.newMachine = function(clustername, type, timeout, callback) {
	dbLog('newmachine', {clustername: clustername, type: type, timeout: timeout});
	var machine = new Machine({ type: type, timeout: timeout, userid: '00000000'});
	Cluster.findOneAndUpdate({name: clustername}, {$push: {machines: machine}}, {new: true},  callback);
}

exports.getMachine = function(clustername, index, callback) {
	dbLog('getmachine', {clustername: clustername, index: index});
	Cluster.findOne({name: clustername}, 'machines', function(err, cluster) {
		if (err || !cluster)
			callback(err, cluster);
		else
			callback(err, cluster.machines[index]);
	});
}

exports.upsertMachineField = function(clustername, index, field, data, callback) {
	dbLog('upsertmachinefield', {clustername: clustername, index: index, field: field, data: data});
	Cluster.findOne({name: clustername}, 'machines', function(err, cluster) {
		if (err || !cluster)
			callback(err, cluster);
		else {
			if (!cluster.machines[index]) {
				callback(err, cluster);
			} else {
				cluster.machines[index][field] = data;
				cluster.save(callback);
			}
		}
	});
}

exports.newCluster = function(name, callback) {
	dbLog('newcluster', {name: name});
	Cluster.remove({name: name}, function (err) {
		var cluster = new Cluster({name: name});
		cluster.save(callback);
	});
}

exports.getAllClusters = function(callback) {
	dbLog('getallclusters', {});
	Cluster.find({}, callback);
}

exports.getClusterField = function(name, field, callback) {
	dbLog('getclusterfield', {name: name, field: field});
	Cluster.findOne({name: name}, field, callback);
}

exports.upsertClusterField = function(name, field, data, callback) {
	dbLog('upsertclusterfield', {name: name, field: field, data: data});
	Cluster.findOneAndUpdate({name: name}, { $set: {[field]: data}}, {upsert:true, new: true}, callback);
}

var dbLog = function(action, parameters) {
	var newLog = new Log({ action: action, time: moment(), parameters: parameters});

	newLog.save();
}
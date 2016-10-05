//----------------------------------------------------------------------------------------------
// Mongoose
//----------------------------------------------------------------------------------------------
var mongoose = require('mongoose');

// User definition
var userSchema = new mongoose.Schema({ 
	id: {type: String, unique : true, required : true, dropDups: true }, 
	name: {type: String, required : true }, 
	number: {type: String}
});
var User = mongoose.model('User', userSchema);

// Machine definition
var machineSchema = new mongoose.Schema({
	id: {type: String, unique : true, required : true, dropDups: true },
	type: {type: String, required : true },
	userid: {type: String, required : true }
});
var Machine = mongoose.model('Machine', machineSchema);

// Cluster definition
var clusterSchema = new mongoose.Schema({
	id: {type: String, unique : true, required : true, dropDups: true }, 
	number: {type: Number, required : true }
});
var Cluster = mongoose.model('Cluster', clusterSchema);


exports.connect = function(database) {
	mongoose.connect('mongodb://localhost/' + database);
}

exports.newUser = function(id, name, number, callback) {
	var newUser = new User({ id: id, name: name, number: number});

	newUser.save(callback);
}

exports.getUserField = function(id, field, callback) {
	User.findOne({ 'id': id }, field, callback);
}

exports.upsertUserField = function(id, field, data, callback) {
	User.findOneAndUpdate({id: id}, { $set: {[field]: data}}, {upsert:true}, callback);
};

exports.newMachine = function(id, type, userid, callback) {
	var newMachine = new Machine({ id: id, type: type, userid: userid});

	newMachine.save(callback);
}

exports.getMachineField = function(id, field, callback) {
	Machine.findOne({ 'id': id }, field, callback);
}

exports.upsertMachineField = function(id, field, data, callback) {
	Machine.findOneAndUpdate({id: id}, { $set: {[field]: data}}, {upsert:true, new: true}, callback);
}

exports.getAllClusters = function(callback) {
	Cluster.find({}, callback);
}

exports.upsertClusterField = function(id, field, data, callback) {
	Cluster.findOneAndUpdate({id: id}, { $set: {[field]: data}}, {upsert:true, new: true}, callback);
}
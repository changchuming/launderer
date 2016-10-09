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
	type: {type: String, required : true },
	userid: {type: String, required : true }
});
var Machine = mongoose.model('Machine', machineSchema);

// Cluster definition
var clusterSchema = new mongoose.Schema({
	name: {type: String, unique : true, required : true, dropDups: true }, 
	machines: [machineSchema]
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
	User.findOne({ id: id }, field, callback);
}

exports.upsertUserField = function(id, field, data, callback) {
	User.findOneAndUpdate({id: id}, { $set: {[field]: data}}, {upsert:true}, callback);
};

exports.newMachine = function(clustername, type, callback) {
	var machine = new Machine({ type: type, userid: '00000000'});
	Cluster.findOneAndUpdate({name: clustername}, {$push: {machines: machine}}, {new: true},  callback);
}

exports.getMachine = function(clustername, index, callback) {
	Cluster.findOne({name: clustername}, 'machines', function(err, cluster) {
		if (err || !cluster)
			callback(err, cluster);
		else
			callback(err, cluster.machines[index]);
	});
}

exports.upsertMachineField = function(clustername, index, field, data, callback) {
	Cluster.findOne({name: clustername}, 'machines', function(err, cluster) {
		if (err || !cluster)
			callback(err, cluster);
		else {
			console.log(cluster);
			cluster.machines[index][field] = data;
			cluster.save(callback);
		}
	});
}

exports.newCluster = function(name, callback) {
	Cluster.remove({name: name}, function (err) {
		var cluster = new Cluster({name: name});
		cluster.save(callback);
	});
}

exports.getAllClusters = function(callback) {
	Cluster.find({}, callback);
}

exports.getClusterField = function(name, field, callback) {
	Cluster.findOne({name: name}, field, callback);
}

exports.upsertClusterField = function(name, field, data, callback) {
	Cluster.findOneAndUpdate({name: name}, { $set: {[field]: data}}, {upsert:true, new: true}, callback);
}
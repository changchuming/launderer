var clusters;

var vueVM = new Vue({
  el: '#cluster',
  data: {
    title: 'Clusters',
    clusters: []
  }
});

setInterval(function(){
	vueVM.clusters.forEach(function (cluster) {
		if (cluster.machines) {
			cluster.machines.forEach(function (machine) {
				if (machine.timeleft.asSeconds() > 0) {
					machine.timeleft.subtract(1, 'seconds');
				}
				// console.log(machine);
			});
		}
	});
}, 1000);

$.post('/getallclusters', function(data, status, xhr) {
	if (data) {
		clusters = data;
		clusters.forEach(function(cluster) {
			var clusterVM = {
				name: cluster.name,
				machines: []
			};

			// Recurse through all machines and get their usage
			getMachineUsage(cluster, 0, clusterVM);
			vueVM.clusters.push(clusterVM);
		});
	}
});

var getMachineUsage = function(cluster, index, clusterVM) {
	if (cluster.machines.length > index) {
		$.post('/getmachineusage', {clustername: cluster.name, index: index}, function(data, status, xhr) {
			var username;
			if (!data) {
				username = "None";
			}
			else {
				username = data.username;
			}

			var timeleft = moment.duration(data.timeleft, 'seconds');

			clusterVM.machines.push({
				type: cluster.machines[index].type, 
				username: username, 
				timeleft: moment.duration(data.timeleft, 'seconds'),
				timeout: data.timeout,
				display: function() {
					return moment(this.timeleft._data).format('mm:ss');
				},
				percent: function () {
					return this.timeleft.asSeconds()/this.timeout*100;
				}
			});
			getMachineUsage(cluster, index+1, clusterVM);
		});
	}
}
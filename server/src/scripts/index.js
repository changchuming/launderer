var clusters;

// $.post('/addcluster', {name: 'GARUDA'}, function(data, status, xhr) {
// 	console.log(data);

// 	$.post('/addmachine', {clustername: 'GARUDA', type: 'Dryer'}, function(data, status, xhr) {
// 		console.log(data);
// 	});

// 	$.post('/addmachine', {clustername: 'GARUDA', type: 'Dryer'}, function(data, status, xhr) {
// 		console.log(data);
// 	});

// 	$.post('/addmachine', {clustername: 'GARUDA', type: 'Washer'}, function(data, status, xhr) {
// 		console.log(data);
// 	});

// 	$.post('/addmachine', {clustername: 'GARUDA', type: 'Washer'}, function(data, status, xhr) {
// 		console.log(data);
// 	});
// });

// $.post('/adduser', {id:'00000000', name: 'lol', number: '00000000'}, function(data, status, xhr) {
// 	console.log(data);
// });

// $.post('/setmachineusage', {clustername:'GARUDA', index: 0, userid: '00000000'}, function(data, status, xhr) {
// 	console.log(data);
// });

// $.post('/setmachineusage', {clustername:'GARUDA', index: 1, userid: '00000000'}, function(data, status, xhr) {
// 	console.log(data);
// });

// $.post('/setmachineusage', {clustername:'GARUDA', index: 3, userid: '00000000'}, function(data, status, xhr) {
// 	console.log(data);
// });

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
				if (machine.timeleft > 0) {
					machine.timeleft -= 1000;
				}
				// console.log(machine);
			});
		}
	});
}, 1000);

$.post('/getallclusters', function(data, status, xhr) {
	console.log(data);
	if (data) {
		clusters = data;
		clusters.forEach(function(cluster) {
			var clusterVM = {
				name: cluster.name,
				machines: []
			};

			cluster.machines.forEach(function(machine) {
				console.log(cluster.name+','+ cluster.machines.indexOf(machine));
				$.post('/getmachineusage', {clustername: cluster.name, index: cluster.machines.indexOf(machine)}, function(data, status, xhr) {
					var username;
					if (!data) {
						username = "None";
					}
					else {
						username = data.username;
					}

					clusterVM.machines.push({
						type: machine.type, 
						username: username, 
						timeleft: data.timeleft,
						timeout: data.timeout,
						minutes: function() {
									var mins = Math.floor(this.timeleft/60000);
									if (mins < 10) {
										mins = '0' + mins;
									}
									return mins;
								},
						seconds: function() {
									var secs = Math.floor((this.timeleft-Math.floor(this.timeleft/60000)*60000)/1000);
									if (secs < 10) {
										secs = '0' + secs;
									}
									return secs;
								},
						percent: function () {
									return this.timeleft/this.timeout*100;
								}
					});
				});
			});
			vueVM.clusters.push(clusterVM);
		});
	}
});

console.log(vueVM.clusters);

// var displayCluster = function(cluster) {
// 	for (i=0;i<cluster.number;i++) {

// 	}
// }

// $.post('/adduser', {id: '5', name: 'user5', number: '00000000'}, function(data, status, xhr) {
// 	console.log(data);
// });



// $.post('/setmachineusage', {id: 'abc', userid: '1'}, function(data, status, xhr) {
// 	console.log(data);
// });

// $.post('/getmachineusage', {id: 'abc'}, function(data, status, xhr) {
// 	console.log('Get machine usage: '+data);
// });
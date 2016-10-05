var houses;

$.post('/addcluster', {id: '1', number: 5}, function(data, status, xhr) {
	console.log(data);
});

$.post('/getallclusters', function(data, status, xhr) {
	houses = data;
	houses.forEach(function(house) {
		console.log(house.id)
	});
});

$.post('/adduser', {id: '5', name: 'user5', number: '00000000'}, function(data, status, xhr) {
	console.log(data);
});

$.post('/addmachine', {id: 'abc', type: 'washer'}, function(data, status, xhr) {
	console.log(data);
});

$.post('/setmachineusage', {id: 'abc', userid: '1'}, function(data, status, xhr) {
	console.log(data);
});

$.post('/getmachineusage', {id: 'abc'}, function(data, status, xhr) {
	console.log('Get machine usage: '+data);
});
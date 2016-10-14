# Launderer server

## Usage

You can set up your own client to perform other functions besides monitoring laundry. Here is a list of post requests you can do to the server. Examples are written using jquery's post, but you can use any method to send the post request.

### Clusters
1. To add a cluster of machines
```javascript
$.post(server + '/addcluster', {name: clusterName}, function(data, status, xhr) {
  // Returns true or false
});
```
3. To get all clusters with their respective machines
```javascript
$.post(server + '/getallclusters', function(data, status, xhr) {
  // Returns all clusters as json object or false
});
```

### Machines
1. To add a machine
```javascript
$.post(server + '/addmachine', {clustername: clusterName, type: machineType, timeout: machineTimeout}, function(data, status, xhr) {
  // Returns true or false
});
```
2. To get machine usage
```javascript
$.post(server + '/getmachineusage', {clustername: clusterName, index: machineIndex}, function(data, status, xhr) {
  // Returns username or false
});
```

3. To set machine usage (userID is optional)
```javascript
$.post(server + '/setmachineusage', {clustername: clusterName, index: machineIndex, userid: userID}, function(data, status, xhr) {
  // Returns true or false
});
```
4. To clear machine usage (userID is optional)
```javascript
$.post(server + '/clearmachineusage', {clustername: clusterName, index: machineIndex, userid: userID}, function(data, status, xhr) {
  // Returns true or false
});
```

### Users
1. To add a user
```javascript
$.post(server + '/adduser', {id: userID, name: userName, number: userPhoneNumber}, function(data, status, xhr) {
  // Returns true or false
});
```

2. To check whether user is in database
```javascript
$.post(server + '/checkuser', {id: userID}, function(data, status, xhr) {
  // Returns username if user exists, else returns false
});
```

## Developing

1. Make sure you have nodejs, npm, and mongodb installed.
2. Install gulp with `npm install gulp -g`.
3. Install bower with `npm install bower -g`.
4. Do `npm install` to install node dependencies.
5. Do `bower install` to install bower dependencies.
6. Do `gulp` to build and track changes.
7. Make sure mongodb is running.
8. Start server or client.

### Tools
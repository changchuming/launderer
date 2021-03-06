# Launderer
## TODO
If anyone would like to refactor the messy code and teach me industry best practices or save me from callback hell, please let me know at changchuming@gmail.com. Thank you.

## Usage

You can set up your own client to perform other functions besides monitoring laundry. Here is a list of post requests you can do to the server. Examples are written using jquery's post, but you can use any method to send the post request.

### Clusters
To add a cluster of machines
```javascript
$.post(server + '/addcluster', {name: clusterName}, function(data, status, xhr) {
  // Returns true or false
});
```
To get all clusters with their respective machines
```javascript
$.post(server + '/getallclusters', function(data, status, xhr) {
  // Returns all clusters as json object or false
});
```

### Machines
To add a machine
```javascript
$.post(server + '/addmachine', {clustername: clusterName, type: machineType, timeout: machineTimeout}, function(data, status, xhr) {
  // Returns true or false
});
```
To get machine usage
```javascript
$.post(server + '/getmachineusage', {clustername: clusterName, index: machineIndex}, function(data, status, xhr) {
  // Returns username or false
});
```

To set machine usage (userID is optional)
```javascript
$.post(server + '/setmachineusage', {clustername: clusterName, index: machineIndex, userid: userID}, function(data, status, xhr) {
  // Returns true or false
});
```
To clear machine usage (userID is optional)
```javascript
$.post(server + '/clearmachineusage', {clustername: clusterName, index: machineIndex, userid: userID}, function(data, status, xhr) {
  // Returns true or false
});
```

### Users
To add a user
```javascript
$.post(server + '/adduser', {id: userID, name: userName, number: userPhoneNumber}, function(data, status, xhr) {
  // Returns true or false
});
```

To check whether user is in database
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

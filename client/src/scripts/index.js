// #####################################################################################
// Screens
// #####################################################################################
var showCluster = function() {
  $('#message').text('');

  $('#cluster').show();
  $('#register').hide();
};

var showAnonymous = function() {
  $('#message').text('No identity detected. The timer has been set.');

  $('#cluster').hide();
  $('#register').hide();
  setTimeout(showCluster, 3000);
};

var showIdentified = function(username) {
  $('#message').text('Hi ' + username + ', you will be notified when your laundry is done.');

  $('#cluster').hide();
  $('#register').hide();
  setTimeout(showCluster, 3000);
};

var showRegister = function() {
  $('#message').text('New user detected. Please register.');
  $('#name').val('');
  $('#number').val('');

  $('#cluster').hide();
  $('#register').show();
  setTimeout(showCluster, 60000);
};

var showCancelled = function(username) {
  $('#message').text('Your laundry job has been cancelled.');

  $('#cluster').hide();
  $('#register').hide();
  setTimeout(showCluster, 3000);
};

var showError = function(error) {
  $('#message').text(error);

  $('#cluster').hide();
  $('#register').hide();
  setTimeout(showCluster, 3000);
};

$(document).ready(function() {
  showCluster;
});

// #####################################################################################
// Setup
// #####################################################################################

var server = 'http://128.199.172.201:3000';

var vueVM = new Vue({
  el: '#cluster',
  data: {
    title: 'GARUDA',
    machines: []
  }
});

vueVM.machines.push({type: 'Dryer', timeout: 1800, inuse: '../img/dryer-inuse.png', idle: '../img/dryer-idle.png', state: 0, user: 'Anon'});
vueVM.machines.push({type: 'Dryer', timeout: 1800, inuse: '../img/dryer-inuse.png', idle: '../img/dryer-idle.png', image: '../img/dryer.png', state: 0, user: 'Anon'});
vueVM.machines.push({type: 'Washer', timeout: 2100, inuse: '../img/washer-inuse.png', idle: '../img/washer-idle.png', image: '../img/washer.png', state: 0, user: 'Anon'});
vueVM.machines.push({type: 'Washer', timeout: 2100, inuse: '../img/washer-inuse.png', idle: '../img/washer-idle.png', image: '../img/washer.png', state: 0, user: 'Anon'});

// $.post(server + '/addcluster', {name: vueVM.title}, function(data, status, xhr) {
//   vueVM.machines.forEach(function(machine) {
//      $.post(server + '/addmachine', {clustername: vueVM.title, type: machine.type, timeout: machine.timeout}, function(data, status, xhr) {
//        console.log(data);
//      });
//   });
// });


// Prevent dragging
$('#cluster').on('dragstart', function(event) {
 event.preventDefault(); 
});

// #####################################################################################
// Actions
// #####################################################################################

var jobTimers = [];

var resetMachine = function(index) {
  console.log(index+' timeout');
  vueVM.machines[index].state = 0;
};

var gClusterName, gIndex, gUid;
var registerNewUser =  function() {
  if ($('#name').val() == '') {
    $('#message').text('Name cannot be blank!');
  } else if ($('#number').val().length != 8) {
    $('#message').text('Number must be 8 digits!');
  } else {
    $.post(server + '/adduser', {id: gUid, name: $('#name').val(), number: '+65' + $('#number').val()}, function(result, status, xhr) {
      if (!result) {
        showError('Error adding user, please try again!');
      } else {
        $.post(server + '/setmachineusage', {clustername: gClusterName, index: gIndex, userid: gUid}, function(result2, status, xhr) {
          if (!result2) {
            showError('Error starting job, please try again!');
          }
          vueVM.machines[gIndex].user = $('#name').val();
          vueVM.machines[gIndex].state = 1;
          jobTimers[gIndex] = setTimeout(resetMachine, vueVM.machines[gIndex].timeout*1000, gIndex);
          showIdentified($('#name').val());
        });
      }
    });
  }
};

var setMachineUsage = function(clustername, index) {
  $('#cluster').hide();
  // Get user id
  $.post('/getuserid', function (uid, status, xhr) {
    // If there is user id
    if (uid) {
      $.post(server + '/checkuser', {id: uid}, function (data, status, xhr) {
        // If user is in database, set machine usage
        if (data) {
          $.post(server + '/setmachineusage', {clustername: clustername, index: index, userid: uid}, function(result, status, xhr) {
            // If error
            if (!result) {
              showError('Error setting job, please try again!');
            // If success
            } else {
              vueVM.machines[index].user = data;
              vueVM.machines[index].state = 1;
              showIdentified(data);
              console.log(vueVM.machines[index].timeout*1000);
              jobTimers[index] = setTimeout(resetMachine, vueVM.machines[index].timeout*1000, index);
              console.log(result);
            }
          });
        // If user is not in database, register
        } else {
          gClusterName = clustername;
          gIndex = index;
          gUid = uid;
          showRegister();
        }
      });
    // If there isn't user id
    } else {
      $.post(server + '/setmachineusage', {clustername: clustername, index: index}, function(data, status, xhr) {
        // If error
        if (!data) {
          showError('Error setting job, please try again!');
        } else {
          vueVM.machines[index].user = 'Anon';
          vueVM.machines[index].state = 1;
          console.log(vueVM.machines[index].timeout*1000);
          jobTimers[index] = setTimeout(resetMachine, vueVM.machines[index].timeout*1000, index);
          showAnonymous();        
          console.log(data);
        }
      });
    }
  });
};

var clearMachineUsage = function(clustername, index) {
  $('#cluster').hide();
  $.post('/getuserid', function (uid, status, xhr) {
    $.post(server + '/clearmachineusage', {clustername: clustername, index: index, userid: uid}, function(result, status, xhr) {
      // If error
      if (!result) {
        showError('Error cancelling job, please try again! You can only cancel jobs started with your own card.');
      } else {
        vueVM.machines[index].user = 'Anon';
        vueVM.machines[index].state = 0;
        clearTimeout(jobTimers[index]);
        showCancelled();
      }
    });
  });  
};

var toggleMachineUsage = function (clustername, index) {
  // If idle
  if (!vueVM.machines[index].state) {
    setMachineUsage(clustername, index);
  } else {
    clearMachineUsage(clustername, index);
  }
};

$('#submit').click(function() {
  registerNewUser();
});

// #####################################################################################
// Keyboard Setup
// #####################################################################################

$('#name').keyboard({
    layout: 'custom',
    customLayout: {
      'normal': [
        'q w e r t y u i o p {bksp}',
        'a s d f g h j k l',
        'z x c v b n m',
        '{shift} {space} {accept}'
      ],
      'shift' : [
        'Q W E R T Y U I O P {bksp}',
        'A S D F G H J K L',
        'Z X C V B N M',
        '{shift} {space} {accept}'
      ]
    },
    usePreview: false,
    acceptValid: true,
    validate: function(kb, val) {
      return val.length > 3;
    }
  })
  // activate the typing extension
  .addTyping({
    showTyping: true,
    delay: 250
  })
  .addExtender({
    layout: 'numpad',
    showing: false,
    reposition: true
  });

// Keyboard for number field
$('#number').keyboard({
    layout: 'custom',
    customLayout: {
      'normal': [
        '1 2 3',
        '4 5 6',
        '7 8 9',
        '{bksp} 0 {accept}'
      ]
    },
    usePreview: false,
    acceptValid: true,
    validate: function(kb, val) {
      return val.length > 3;
    }
  })
  // activate the typing extension
  .addTyping({
    showTyping: true,
    delay: 250
  })
  .addExtender({
    layout: 'numpad',
    showing: false,
    reposition: true
  });

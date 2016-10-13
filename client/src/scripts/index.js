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
}

var showIdentified = function(username) {
  $('#message').text('Hi ' + username + ', you will be notified when your laundry is done.');

  $('#cluster').hide();
  $('#register').hide();
  setTimeout(showCluster, 3000);
};

var showRegister = function() {
  $('#message').text('New user detected. Please register.');
  $('#name').text('');
  $('#number').text('');

  $('#cluster').hide();
  $('#register').show();
  setTimeout(showCluster, 30000);
};

var showError = function() {
  $('#message').text('An error occurred. Please try again.');

  $('#cluster').hide();
  $('#register').hide();
  setTimeout(showCluster, 3000);
}

showCluster();

var server = 'http://128.199.172.201:3000';

var vueVM = new Vue({
  el: '#cluster',
  data: {
    title: 'GARUDA',
    machines: []
  }
});

vueVM.machines.push({type: 'Dryer', timeout: 1800, image: '../img/dryer.png', state: 'Idle'});
vueVM.machines.push({type: 'Dryer', timeout: 1800, image: '../img/dryer.png', state: 'Idle'});
vueVM.machines.push({type: 'Washer', timeout: 1800, image: '../img/washer.png', state: 'Idle'});
vueVM.machines.push({type: 'Washer', timeout: 1800, image: '../img/washer.png', state: 'In use'});

var setMachineUsage = function (clustername, index) {
  $.post('/getuserid', function (uid, status, xhr) {
    if (uid) {
      $.post(server + '/checkuser', {id: uid}, function (data, status, xhr) {
        if (data) {
          showIdentified(data);
          console.log(data);
        } else {
          newUser.clustername = clustername;
          newUser.index = index;
          newUser.uid = uid;
          showRegister();
        }
      });
    } else {
      $.post(server + '/setmachineusage', {clustername: clustername, index: index}, function(data, status, xhr) {
        showAnonymous();
        console.log(data);
      });
    }
  });
};

var newUser = {
  register: function() {
    $.post(server + '/adduser', {id: this.uid, name: $('#name').val(), number: '+65' + $('number').val()}, function(data, status, xhr) {
      if (data) {
        $.post(server + '/setmachineusage', {clustername: this.clustername, index: this.index, userid: this.uid}, function(data, status, xhr) {
          console.log(data);
        });
      } else {
        
      }
    });
  }
}


// $.post(server + '/addcluster', {name: vueVM.title}, function(data, status, xhr) {
//   vueVM.machines.forEach(function(machine) {
//      $.post(server + '/addmachine', {clustername: vueVM.title, type: machine.type, timeout: machine.timeout}, function(data, status, xhr) {
//        console.log(data);
//      });
//   });
// });

// $.post(server + '/adduser', {id:'00000000', name: 'lol', number: '00000000'}, function(data, status, xhr) {
//  console.log(data);
// });

// $.post(server + '/setmachineusage', {clustername:'GARUDA', index: 3, userid: '00000000'}, function(data, status, xhr) {
//  console.log(data);
// });



// $.post(server + '/setmachineusage', {clustername:'GARUDA', index: 6, userid: '00000000'}, function(data, status, xhr) {
//  console.log(data);
// });

// $.post(server + '/clearmachineusage', {clustername:'GARUDA', index: 3}, function(data, status, xhr) {
//  console.log(data);
// });

// Keyboard for name field
$('#name').keyboard({
    layout: 'custom',
    customLayout: {
      'normal': [
        'q w e r t y u i o p {bksp}',
        'a s d f g h j k l {enter}',
        'z x c v b n m'
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
        '{bksp} 0 {enter}'
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

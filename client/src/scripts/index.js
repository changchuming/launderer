$('#anonymous').hide();
$('#identified').hide();
$('#register').hide();

// $.post('/addcluster', {name: 'GARUDA'}, function(data, status, xhr) {
//  console.log(data);

//  $.post('/addmachine', {clustername: 'GARUDA', type: 'Dryer', timeout: '1800'}, function(data, status, xhr) {
//    console.log(data);
//  });

//  $.post('/addmachine', {clustername: 'GARUDA', type: 'Dryer', timeout: '1800'}, function(data, status, xhr) {
//    console.log(data);
//  });

//  $.post('/addmachine', {clustername: 'GARUDA', type: 'Washer', timeout: '2100'}, function(data, status, xhr) {
//    console.log(data);
//  });

//  $.post('/addmachine', {clustername: 'GARUDA', type: 'Washer', timeout: '2100'}, function(data, status, xhr) {
//    console.log(data);
//  });
// });

// $.post('/adduser', {id:'00000000', name: 'lol', number: '00000000'}, function(data, status, xhr) {
//  console.log(data);
// });

// $.post('/setmachineusage', {clustername:'GARUDA', index: 0, userid: '00000000'}, function(data, status, xhr) {
//  console.log(data);
// });

// $.post('/setmachineusage', {clustername:'GARUDA', index: 1, userid: '00000000'}, function(data, status, xhr) {
//  console.log(data);
// });

// $.post('/setmachineusage', {clustername:'GARUDA', index: 3, userid: '00000000'}, function(data, status, xhr) {
//  console.log(data);
// });

// $.post('/clearmachineusage', {clustername:'GARUDA', index: 3}, function(data, status, xhr) {
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

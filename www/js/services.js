angular.module('ionicApp.services', [])

.factory('edmData', function() {

    var ipLocation="0.0.0.0:00";

    var edmBuffer;


  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'li zilun',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'wang junyang',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {

    ipInput: function (data) {
      ipLocation=data;
    },
    ipGet: function(){
      return ipLocation;
    },
    all: function () {
      return CMDedm;
    },
    inputBuffer: function (data) {
      edmBuffer = data;
    },
    getBuffer: function(){
      return edmBuffer;

    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});

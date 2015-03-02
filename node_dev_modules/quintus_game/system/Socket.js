var socket = io();

var Socket = {
  send: {
    nextAction: function(data) {
      socket.emit('nextAction', data);
    }
  }
}

socket.on('setState', function(msg) {
  State.setState(JSON.parse(msg));
});


function callback(stream) {
  var context = new AudioContext();
  var mediaStreamSource = context.createMediaStreamSource(stream);
}

function error(e) {
  console.log(e);
}

$(document).ready(function() {
  // var socket = io.connect('http://localhost:9000');
  //
  // socket.on('connect', function() {
  //   console.log('connected...' + socket.id);
  // })
  //
  // socket.emit('message', {text: "hello"});

  navigator.webkitGetUserMedia({
    audio: true
  }, callback, error)

  // $('.start-recording').on('click', function() {
  //   rec.record();
  //
  //   intervalKey = setInterval(function() {
  //     rec.exportWAV(function(blob) {
  //       rec.clear();
  //       socket.emit('message', blob);
  //     });
  //   }, 1000);
  // });
  //
  // $('.stop-recording').on('click', function() {
  //   rec.stop();
  //   clearInterval(intervalKey);
  // });

});

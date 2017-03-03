
function callback(stream) {
  var context = new webkitAudioContext();
  var mediaStreamSource = context.createMediaStreamSource(stream);
}

$(document).ready(function() {
  navigator.webkitGetUserMedia({
    audio: true
  }, callback)
});

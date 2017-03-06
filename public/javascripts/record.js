var audioElement = document.createElement('audio');

function callback(stream) {
    var context = new AudioContext();
    var mediaStreamSource = context.createMediaStreamSource(stream);
}

function error(e) {
    console.log(e);
}

function searchAndPlay(text) {
  audioElement.pause();
  $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/getlink',
      data: {
          text: text
      },
      success: function(song) {
          var html = '<div class="song">';
          html += '<span class="title">' + song.title + '</span>';
          html += '<span>128k <a href="' + song.download_link_128 + '" target="_blank">' + song.download_link_128 + '</a></span>';
          html += '<span class="source"><strong>' + song.source + '</strong></span>';
          html += '</div>';
          $('.songs').prepend(html);

          audioElement.setAttribute('src', song.download_link_128);
          audioElement.addEventListener('ended', function() {
              this.play();
          }, false);
          audioElement.play();
      },
      beforeSend: function() {
          $('.loading').show();
      },
      complete: function() {
          $('.loading').hide();
      }
  });
}

$(document).ready(function() {
    $('.loading').hide();

    var socket = io.connect('http://localhost:9000');

    socket.on('connect', function() {
        console.log('connected...' + socket.id);
    })

    socket.on('resultRecognize', function(text) {
        $('.inputMessage').val(text);
    });

    navigator.webkitGetUserMedia({
        audio: true
    }, callback, error)

    $('.record').on('mousedown', function() {
        console.log('START recording...');
        socket.emit('start');
    });

    $('.record').on('mouseup', function() {
        console.log('STOP recording');
        socket.emit('stop');

        var text = $('.inputMessage').val();
        searchAndPlay(text);
    });

    $('.inputMessage').on('keydown', function(event) {
        if (event.keyCode == 13) {
            audioElement.pause();
            var text = $(this).val();
            $(this).val('');

            searchAndPlay(text);
        }
    })
});

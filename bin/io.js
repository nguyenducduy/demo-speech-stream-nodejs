var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');
const record = require('node-record-lpcm16');
// Imports the Google Cloud client library
const Speech = require('@google-cloud/speech');

// Instantiates a client
const speech = Speech();

io.on('connection', function(socket) {
    socket.on('start', function(data) {
        // The encoding of the audio file, e.g. 'LINEAR16'
        const encoding = 'LINEAR16';

        // The sample rate of the audio file, e.g. 16000
        const sampleRate = 16000;

        const languageCode = 'vi-VN';

        const request = {
            config: {
                encoding: encoding,
                sampleRate: sampleRate,
                languageCode: languageCode
            },
            singleUtterance: false, // continuous listen, don't wait user stop speaking.
            interimResults: true
        };

        // Create a recognize stream
        const recognizeStream = speech.createRecognizeStream(request)
            .on('error', console.error)
            .on('data', (data) => {
                // console.log(process);
                // process.stdout.write(data.results)
                if (data.results.length > 0) {
                    socket.emit('resultRecognize', data.results);
                }
            });

        // var file = fs.createWriteStream('test.wav', { encoding: 'binary' });
        // record.start().pipe(file);
        // Start recording and send the microphone input to the Speech API
        record.start({
                sampleRate: sampleRate,
                threshold: 0
            })
            .pipe(recognizeStream);

        console.log('start streaming...');
    });

    socket.on('stop', function(data) {
        record.stop();
        console.log('stop streaming.');
    });
});

server.listen(9000);

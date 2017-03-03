var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const record = require('node-record-lpcm16');

  // Imports the Google Cloud client library
  const Speech = require('@google-cloud/speech');

  // Instantiates a client
  const speech = Speech();
  // Your Google Cloud Platform project ID
  const projectId = 'iviet-project-0';

  // Instantiates a client
  const speechClient = Speech({
    projectId: projectId
  });

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
    singleUtterance: false,
    interimResults: true
  };

  // Create a recognize stream
  const recognizeStream = speech.createRecognizeStream(request)
    .on('error', console.error)
    .on('data', (data) => {
      // console.log(process);
      process.stdout.write(data.results)
    });

  // Start recording and send the microphone input to the Speech API
  record.start({
    sampleRate: sampleRate,
    threshold: 0
  }).pipe(recognizeStream);

  res.render('index', { title: 'hello world.' });
});

module.exports = router;

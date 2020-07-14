var WitSpeech = require('node-witai-speech');
var wavConverter = require('wav-converter');
const config = require('./config');
const request = require('request');
const underscore = require('underscore');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path')
const recordingsPath = ('./recordings');
var pcmData = fs.readFileSync(path.resolve(__dirname, './user_audio'))
var wavData = wavConverter.encodeWav(pcmData, {
    numChannels: 2,
    sampleRate: 48000,
    byteRate: 16
})

fs.writeFileSync(path.resolve(__dirname, './user_audio.wav'), wavData)

// Stream the file to be sent to the wit.ai
var stream = fs.createReadStream("C://Users//Ryan DeHaan//WebstormProjects//Javascript//js//user_audio.wav");

// The wit.ai instance api key
var API_KEY = "BLP6LJH5ZYX4PFDYNSWWIZTWPHDK3HU5";

// The content-type for this audio stream (audio/wav, ...)
var content_type = "audio/wav";

// Its best to return a promise
var parseSpeech =  new Promise((ressolve, reject) => {
    // call the wit.ai api with the created stream
    WitSpeech.extractSpeechIntent(API_KEY, stream, content_type,
        (err, res) => {
            if (err) return reject(err);
            ressolve(res);
        });
});

// check in the promise for the completion of call to witai
parseSpeech.then((data) => {
    console.log(data.text);
})
    .catch((err) => {
        console.log(err);
    })

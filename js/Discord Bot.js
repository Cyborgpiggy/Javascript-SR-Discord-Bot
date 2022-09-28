const Discord = require('discord.js')
const config = require('./config')
const fs = require('fs');
var WitSpeech = require('node-witai-speech');
var wavConverter = require('wav-converter');
const path = require('path')
const recordingsPath = ('./recordings');

const discordClient = new Discord.Client()

discordClient.on('ready', () => {
    console.log(`Logged in as ${discordClient.user.tag}!`)
})

discordClient.on('presenceUpdate', async (oldPresence, newPresence) => {
    console.log('New Presence:', newPresence)

    const member = newPresence.member
    const presence = newPresence
    const memberVoiceChannel = member.voice.channel

    if (!presence || !presence.activity || !presence.activity.name || !memberVoiceChannel){
        return
    }

    const connection = await memberVoiceChannel.join()

    connection.on('speaking', (user, speaking) =>{
        const audio = connection.receiver.createStream(user, {mode: 'pcm'});

        audio.pipe(fs.createWriteStream('./user_audio'));
        if(speaking){
            console.log(`I'm listening to ${user.username}`)
        } else{
            console.log(`I stopped listening to ${user.username}`)
        }
    })
})
const pcmData = fs.readFileSync(path.resolve(__dirname, './user_audio'))
const wavData = wavConverter.encodeWav(pcmData, {
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

// Create an event listener for messages
discordClient.on('message',  message => {
    // If the message is "ping"
    if (message.content === 'ping') {
        // Send "pong" to the same channel
        message.channel.send('pong');
    }
    if (message.content === 'hello'){
        message.channel.send('world');
    }

});

discordClient.on('message', async message => {
    if (message.content === 'join'){
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
        }
    }
    if (message.content === 'leave') {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.leave();
        }
    }
});

discordClient.login(config.discordApiToken)




const Discord = require('discord.js')
const config = require('./config')
const fs = require('fs');

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

// Create an event listener for messages
discordClient.on('message', message => {
    // If the message is "ping"
    if (message.content === 'ping') {
        // Send "pong" to the same channel
        message.channel.send('pong');
    }
    if (message.content === 'hello') {
        message.channel.send('world');
    }
    if (message.content === 'N-Word'){
        message.channel.send('Nesquik')
    }
});
discordClient.login(config.discordApiToken)

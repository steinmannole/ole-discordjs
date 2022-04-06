const { CommandInteraction, Client ,MessageEmbed } = require("discord.js");

module.exports = {
    name: "music",
    description: "Hör jetzt deine Musik",
    permission: "ADMINISTRATOR",
    options: [
        { name: "play", description: "Geben Sie einen Namen oder eine URL an", type: "SUB_COMMAND",
            option: [{ name: "query", description: "Geben Sie einen Namen oder eine URL an", type: "STRING", required: true}]
        },
        { name: "volume", description: "Ändern Sie die Lautstärke", type: "SUB_COMMAND",
            options: [{ name: "prozent", description: "10 = 10%", type: "NUMBER", required: true}]
        },
        { name: "settings", description: "Wähle eine Option", type: "SUB_COMMAND",
            options: [{ name: "options", description: "Wähle eine Option", type: "STRING", required: true,
            choices: [
                {name: "🔢 Warteschlange", value: "queue"},
                {name: "⏭️ Überspring Song", value: "skip"},
                {name: "⏸️ Pause Song", value: "pause"},
                {name: "⏯️ Fortsetzen des Songs", value: "resume"},
                {name: "⏹️ Stop Musik", value: "stop"},
            ]}]
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    
    async execute(interaction, client) {
        const { options, member, guild, channel } = interaction;
        const VoiceChannel = member.voice.channel;

        if(!VoiceChannel)
        return interaction.reply({content: "You must be in a voice channel to be able to use the music commands.", ephemeral: true});

        if(guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
        return interaction.reply({content: `I'm already playing music in <#${guild.me.voice.channelId}>.`, ephemeral: true});

        try {
            switch(options.getSubcommand()) {
                case "play" : {
                    client.distube.play( VoiceChannel, options.getString("query"), { textChannel: channel, member: member });
                    return interaction.reply({content: "🎶 Request recieved."});
                } 
                case "volume" : {
                    const Volume = options.getNumber("prozent");
                    if(Volume > 100 || Volume < 1)
                    return interaction.reply({content: "You have to specify a number between 1 and 100."});

                    client.distube.setVolume(VoiceChannel , Volume);
                    return interaction.reply({content: `🎶 Volume has been set to \`${Volume}%\``});
                }
                case "setting" : {
                    const queue = await client.distube.getQueue(VoiceChannel);
                    
                    if(!queue)
                    return interaction.reply({content: "⛔ There is no queue."});

                    switch(options.getString("options")) {
                        case "skip" :
                            await queue.skip(VoiceChannel);
                            return interaction.reply({content: "⏭️ Song has been skipped."})
                            case "stop" : 
                            await queue.stop(VoiceChannel);
                            return interaction.reply({content: "⏹️ Music has been stoppped."})
                            case "pause" :
                            await queue.pause(VoiceChannel);
                            return interaction.reply({content: "⏸️ Song has been paused."})
                            case "resume" :
                            await queue.resume(VoiceChannel);
                            return interaction.reply({content: "⏯️ Song has been resumed."})
                            case "queue" :
                            return interaction.reply({embeds: [new MessageEmbed()
                            .setColor("YELLOW")
                            .setDescription(`${queue.songs.map(
                                (song, id) => `\n**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``)}`
                                )]});
                        }
                    return;
                }
            }
        } catch(e) {
            const errorEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`⛔ Alert: ${e}`)
            return interaction.reply({embeds: [errorEmbed]});
        }
    }
}
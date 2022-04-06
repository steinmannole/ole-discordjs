const { VoiceState, PermissionOverwrites, VoiceChannel } = require("discord.js");

module.exports = {
    name: "voiceStateUpdate",
    /**
     * 
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState 
     */
    async execute(oldState, newState, client) {
        const { member, guild } =  newState;
        const oldChannel = oldState.channel;
        const newChannel = newState.channel;
        const joinToCreate = "878233629053042769"

        if(oldChannel !== newChannel && newChannel && newChannel.id === joinToCreate) {
            const voiceChannel = await guild.channels.create("⏳ | " + member.user.username, {
                type: "GUILD_VOICE",
                parent: newChannel.parent,
                bitrate: 96,
            });

            client.voiceGenerator.set(member.id, voiceChannel.id);
            await newChannel.permissionOverwrites.edit(member, {CONNECT: false})
            setTimeout(() => newChannel.permissionOverwrites.delete(member), 5 * 1000);

            return setTimeout(() => member.voice.setChannel(voiceChannel), 500);
        }

        const ownedChannel = client.voiceGenerator.get(member.id)

        if(ownedChannel && oldChannel.id == ownedChannel && (!newChannel || newChannel.id !== ownedChannel)) {
            client.voiceGenerator.set(member.id, null);
            oldChannel.delete().catch(() => {});
        }
    }
}
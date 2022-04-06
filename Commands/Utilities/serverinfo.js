const { CommandInteraction, MessageEmbed } = require("discord.js");
const { channels } = require("../../Structures");

module.exports = {
    name: "serverinfo",
    description: "Server Info",
    permission: "SEND_MESSAGES",
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    execute(interaction) {
        const { guild } = interaction;

        const { createdTimestamp, ownerId, description, members, memberCount } = guild;

        const Embed = new MessageEmbed()
        .setColor("YELLOW")
        //.setAuthor(guild.name, guild.iconURL({dynamic: true}))
        .setThumbnail(guild.iconURL({dynamic: true}))
        .addFields(
            {
                name: "ALLGEMEIN",
                value: 
                `
                Name: ${guild.name}
                Erstellt: <t:${parseInt(createdTimestamp / 1000)}:R>
                Besitzer: <@${ownerId}>

                Beschreibung: ${description}
                `
            },
            {
                name: "💡 | Benutzer",
                value:  
                `
                - Mitglieder: ${members.cache.filter((m) => !m.user.bot).size}
                - Bots: ${members.cache.filter((m) => m.user.bot).size}

                Total: ${memberCount}
                `
            },
            {
                name: "🚪 | Kanäle",
                value:
                // - Foren: ${channels.cache.filter((c) => c.type === "GUILD_PUBLIC_THREAD" && "GUILD_PRIVATE_THREAD" && "GUILD_NEWS_THREAD").size}
                // - Podium: ${channels.cache.filter((c) => c.type === "GUILD_STAGE_VOICE").size}
                // - News: ${channels.cache.filter((c) => c.type === "GUILD_NEWS").size}
                `
                - Text: ${channels.cache.filter((c) => c.type === "GUILD_TEXT").size}
                - Sprach: ${channels.cache.filter((c) => c.type === "GUILD_VOICE").size}
                - Kategorien: ${channels.cache.filter((c) => c.type === "GUILD_CATEGORY").size}

                Total: ${channels.cache.size}
                `
            }
        )
        //.setFooter().setTimestamp();

        interaction.reply({embeds: [Embed]})
    }
}
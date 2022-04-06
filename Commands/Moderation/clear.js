const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "clear",
    description: "Löscht eine angegebene Anzahl von Nachrichten aus einem Kanal oder Ziel.",
    permission: "MANAGE_MESSAGES",
    options: [
        {
            name: "anzahl",
            description: "Wählen Sie die Anzahl der Nachrichten aus, die aus einem Kanal gelöscht werden sollen.",
            type: "NUMBER",
            required: true
        },
        {
            name: "ziel",
            description: "Wählen Sie ein Ziel aus, um seine Nachrichten zu löschen.",
            type: "USER",
            required: false
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { channel, options } = interaction;

        const Amount = options.getNumber("anzahl");
        const Target = options.getMember("ziel");

        const Messages = await channel.messages.fetch();

        const Response = new MessageEmbed()
        .setColor("YELLOW");

        if(Amount > 100 || Amount <= 0) {
            Response.setDescription(`Der Betrag darf 100 nicht überschreiten und nicht unter 1 liegen.`)
            return interaction.reply({embeds: [Response]})
        }

        if(Target) {
            let i = 0;
            const filtered = [];
            (await Messages).filter((m) => {
                if(m.author.id === Target.id && Amount > i) {
                    filtered.push(m);
                    i++;
                }
            })

            await channel.bulkDelete(filtered, true).then(messages => {
                Response.setDescription(`🧹 Cleared ${messages.size} von ${Target}.`);
                interaction.reply({embeds: [Response]});
            })
        } else {
            await channel.bulkDelete(Amount, true).then(messages => {
                    Response.setDescription(`🧹 Cleared ${messages.size} von diesem Kanal.`);
                    interaction.reply({embeds: [Response]});
            })
        }
    }
}
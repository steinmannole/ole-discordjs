const { MessageEmbed, WebhookClient, GuildMember } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    /**
     * 
     * @param {*} member 
     */
    execute(member) {
        
        const { user, guild } = member;
        
        member.roles.add("910188057205022770");

        /*
        const Welcomer = new WebhookClient({
            id: "960574476960038963",
            token: "rhK7eSyIrvfBV5geXPjSrYntIBxfWQGsCRuXAgm0pKnBMxb6lJYmZkGGz6sO-9blB4Ca"
        });
        */
    }
}

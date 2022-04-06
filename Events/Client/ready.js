const { Client } = require("discord.js");
const mongoos = require("mongoose");
const { Database } = require("../../Structures/config.json");
module.exports = {
    name: "ready",
    once: true,
    /**
    * @param {Client} client
     */
    execute(client) {
        console.log("Ready Event - SUCCESS ✓")
        client.user.setActivity("/ ... ", {type: "LISTENING"})

        if(!Database) return;
        mongoos.connect(Database, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("Database Event - SUCCESS ✓")
        }).catch((err) => {
            console.log(err)
        });
    }

}
// General Imports
const { Client, Collection } = require("discord.js");
const client = new Client({intents: 32767});
const { Token } = require("./config.json");

// CommandHandler Imports
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");

client.commands = new Collection();
client.voiceGenerator = new Collection();

// MusicBot Imports
const { DisTube } = require("distube");
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')

// Created DisTubeClient (MusicClient)
client.distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
        new SpotifyPlugin({
          emitEventsAfterFetching: true
        }),
        new SoundCloudPlugin(),
        new YtDlpPlugin()
      ],
      youtubeDL: false
});
module.exports = client;

["Events", "Commands"].forEach(handler => {
    require(`./Handlers/${handler}`)(client, PG, Ascii)
})

client.on('ready', () => {
    console.log(`${client.user.tag} login - SUCCESS ✓`)
  })

client.login(Token);
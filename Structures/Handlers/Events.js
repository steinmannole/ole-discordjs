const { Events } = require("../Validation/EventNames");

module.exports = async (client, PG, Ascii) => {
    const Table = new Ascii("Events Loaded");

    (await PG(`${process.cwd()}/Events/*/*.js`)).map(async (file) => {
        const events = require(file);

        if(!Events.includes(events.name) || !events.name) {
            const L = file.split("/");
            await Table.addRow(`${events.name || "MISSING"}`, `⛔ Event name is either invalid or missing: ${L[6] + `/` + L[7]}`);
            return;
        }

        if(events.once) {
            client.once(events.name, (...args) => events.execute(...args, client));
        } else {
            client.on(events.name, (...args) => events.execute(...args, client));
        };

        await Table.addRow(events.name, "✓ SUCCESS")
    });

    console.log(Table.toString());

}
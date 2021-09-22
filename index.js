const { Message } = require("discord.js");

const util = require("util"),
fs = require("fs"),
readdir = util.promisify(fs.readdir),
mongoose = require("mongoose");
Discord = require("discord.js");

// Load ManageInvite class
const ManageInvite = require("./structures/Client"),
client = new ManageInvite();




const init = async () => {

    // Search for all commands
    let directories = await readdir("./commands/");
    directories.forEach(async (dir) => {
        let commands = await readdir("./commands/"+dir+"/");
        commands.filter((cmd) => cmd.split(".").pop() === "js").forEach((cmd) => {
            const response = client.loadCommand("./commands/"+dir, cmd);
            if(response){
                client.logger.log(response, "error");
            }
        });
    });

    // Then we load events, which will include our message and ready event.
    const evtFiles = await readdir("./events/");
    evtFiles.forEach((file) => {
        const eventName = file.split(".")[0];
        const event = new (require(`./events/${file}`))(client);
        client.on(eventName, (...args) => event.run(...args));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
     
    client.login(client.config.token); // Log in to the discord api

    // connect to mongoose database
    mongoose.connect(client.config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true }).catch((err) => {
        client.logger.log("Unable to connect to the Mongodb database. Error:"+err, "error");
    });

    // Gets commands permission
    client.levelCache = {};
    for (let i = 0; i < client.permLevels.length; i++) {
      const thisLevel = client.permLevels[parseInt(i, 10)];
      client.levelCache[thisLevel.name] = thisLevel.level;
    }

        

    client.on("shardReady", (shardID) => {
    
        if (shardID === 2){
                const poststats = async () => {
                    const BOATS = require('boats.js');
                    const fetch = require('node-fetch');
                let guildsCounts = await client.shard.fetchClientValues("guilds.cache.size");
                let guildsCountss = guildsCounts[0] + guildsCounts[1] + guildsCounts[2];
                fetch(`https://infinitybotlist.com/api/bots/577236734245470228/`, {
                    method: "POST",
                    headers: {
                        Authorization: "*****",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "servers": guildsCountss,
                        "shards": '1337'
                    })
                })
         }
         poststats();

        }
        const shardlog = new Discord.WebhookClient('863745285196873748', '8dg3iEYuh2TRGq0fs_d-u77_ivKDA69UpzwS7GMCG3RUJ6UGmvwz0Hq_wgkvijG9egIs');
        const gay1 = `<:tick_yes:858555420519301161>
 | Shard #${shardID} is ready!`;
        shardlog.send(gay1);
    });
    client.on("shardDisconnect", (shardID) => {
        const shardlog = new Discord.WebhookClient('863745285196873748', '8dg3iEYuh2TRGq0fs_d-u77_ivKDA69UpzwS7GMCG3RUJ6UGmvwz0Hq_wgkvijG9egIs');
        const gay = `<a:TG_Loading:858555950537506906> | Shard #${shardID} is disconnected...`;
        shardlog.send(gay);
        
    });
    client.on("shardReconnecting", (shardID) => {
        const shardlog = new Discord.WebhookClient('863745285196873748', '8dg3iEYuh2TRGq0fs_d-u77_ivKDA69UpzwS7GMCG3RUJ6UGmvwz0Hq_wgkvijG9egIs');
        const gay2 = `<:tick_no:858555605912387605>
 | Shard #${shardID} is reconnecting...`;
        shardlog.send(gay2);
    });
    client.on("shardResume", (shardID) => {
        const shardlog = new Discord.WebhookClient('863745285196873748', '8dg3iEYuh2TRGq0fs_d-u77_ivKDA69UpzwS7GMCG3RUJ6UGmvwz0Hq_wgkvijG9egIs');
        const gay3 = `<a:Dot:858567127111696414> | Shard #${shardID} has resumed!`;
        shardlog.send(gay3);
    });
};
init();
   

// if there are errors, log them
client.on("disconnect", () => client.logger.log("Bot is disconnecting...", "warn"))
    .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
    .on("error", (e) => client.logger.log(e, "error"))
    .on("warn", (info) => client.logger.log(info, "warn"));

// if there is an unhandledRejection, log them
process.on("unhandledRejection", (err) => {
    console.error(err);
});

const express = require('express')
const app = express();
const port = 3000

app.get('/', (req, res) => res.send('bot online yay boy!!'))

app.listen(port, () =>
console.log(`Your app is listening a http://localhost:${port}`)
);

const { ShardingManager } = require("discord.js");
const manager = new ShardingManager("./index.js", {
    token: require("./config").token,
    totalShards: 1,
    shardArgs: process.argv
});

manager.on('shardCreate', shard => console.log(`Invite+ Shard #${shard.id} lauched !`));
manager.spawn();

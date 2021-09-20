const servers = require("../index.js").servers;
const hasNextAudio = require("../index.js").hasNextAudio;

module.exports = function(msg) {
    const server = servers[msg.guild.id]; 

    server.dispatcher.destroy();

    server.dispatcher = null;
    server.currentVideoUrl = null;
    server.queue = [];
    server.queuePosition = 0;
    server.hasNextAudio = hasNextAudio(server);

    msg.channel.send("Fila limpa.");
}
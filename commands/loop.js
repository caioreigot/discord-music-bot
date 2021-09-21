const servers = require("../index.js").servers;
const ytdl = require("ytdl-core");
const Player = require("../functionalities/playAudio");

module.exports = function(msg) {
    let server = servers[msg.guild.id];

    server.loopEnabled = !server.loopEnabled;

    let status = server.loopEnabled ? "ligado" : "desligado";
    msg.channel.send(`Loop ${status}.`);
    
    // Se o loop foi ativado sem ter próximo áudio/nenhum áudio tocando
    if (server.loopEnabled && !server.hasNextAudio && server.dispatcher == null) {
        const player = new Player(ytdl, server);

        server.queuePosition = 0;
        player.playAudio(
            msg.channel,
            server.queue[server.queuePosition].url, 
            server.queue[server.queuePosition].title,
            server.queue[server.queuePosition].duration
        );
    }
}
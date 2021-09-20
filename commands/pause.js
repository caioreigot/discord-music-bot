const servers = require("../index.js").servers;

module.exports = function(msg) {
    let server = servers[msg.guild.id];

    if (!server.paused) {
        server.dispatcher.pause();
        msg.channel.send("Áudio pausado! Escreva **!resume** para despausar.");
        server.paused = true;
    } else {
        msg.channel.send("O áudio já está pausado!");
    }
}
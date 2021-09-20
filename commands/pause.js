const servers = require("../index.js").servers;

module.exports = function(msg) {
    let server = servers[msg.guild.id];

    if (!server.paused) {
        server.dispatcher.pause();
        server.paused = true;
        msg.channel.send("Áudio pausado! Escreva **!resume** para despausar.");
    } else {
        msg.channel.send("O áudio já está pausado!");
    }
}
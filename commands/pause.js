const servers = require("../index.js").servers;

module.exports = function(msg) {
    servers[msg.guild.id].dispatcher.pause();
    msg.channel.send("Música pausada! Escreva **!resume** para despausar.");
}
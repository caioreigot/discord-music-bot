const servidores = require("../index.js").servidores;

module.exports = function(msg) {
    servidores.server.dispatcher.pause();
    msg.channel.send("Música pausada! Escreva **!resume** para despausar.");
}
const servers = require("../index.js").servers;

module.exports = function(msg) {
    let server = servers[msg.guild.id];

    // Se houver próximo áudio na queue
    if (server.queuePosition + 1 < server.queue.length) {
        server.dispatcher.end();
        msg.channel.send("Áudio atual pulado.");
    } else {
        msg.channel.send("Não existe um próximo áudio na fila para ser reproduzido!");
    }
}
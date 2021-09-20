const servidores = require("../index.js").servidores;

module.exports = function(msg) {
    // Se houver próximo áudio na queue
    if (servidores.server.queuePosition + 1 < servidores.server.queue.length) {
        servidores.server.dispatcher.end();
        msg.channel.send("Áudio atual pulado.");
    } else {
        msg.channel.send("Não existe um próximo áudio na fila para ser reproduzido!");
    }
}
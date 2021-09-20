const servidores = require("../index.js").servidores;

module.exports = function(msg) {
    with (servidores.server) {
        dispatcher.destroy();

        dispatcher = null;
        currentVideoUrl = null;
        queue = [];
        queuePosition = 0;
    }

    msg.channel.send("Fila limpa!");
}
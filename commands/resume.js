const servidores = require("../index.js").servidores;

module.exports = function(msg) {
    resumePlayer();
    msg.channel.send("Música despausada.");
}

function resumePlayer() {
    /* 
     * Devido a um bug na versão atual do Node.js, 
     * é preciso resumir, pausar e resumir novamente o player
     * para que o método "resume" funcione devidamente
    */
    servidores.server.dispatcher.resume();
    servidores.server.dispatcher.pause();
    servidores.server.dispatcher.resume();
}
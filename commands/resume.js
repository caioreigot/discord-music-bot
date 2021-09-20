const servers = require("../index.js").servers;

module.exports = function(msg) {
    let server = servers[msg.guild.id];

    if (server.paused) {
        /* 
        * Devido a um bug na versão atual do Node.js, 
        * é preciso resumir, pausar e resumir novamente o player
        * para que o método "resume" funcione devidamente
        */
        servers[msg.guild.id].dispatcher.resume();
        servers[msg.guild.id].dispatcher.pause();
        servers[msg.guild.id].dispatcher.resume();
        server.paused = false;
        msg.channel.send("Música despausada.");
    } else {
        msg.channel.send("O áudio já está sendo reproduzido!");
    }
}
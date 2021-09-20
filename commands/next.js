const servers = require("../index.js").servers;

module.exports = function(msg) {
    // Se houver próximo áudio na queue
    if (servers[msg.guild.id].queuePosition + 1 < servers[msg.guild.id].queue.length) {
        servers[msg.guild.id].dispatcher.end();
        msg.channel.send("Áudio atual pulado.");
    } else {
        msg.channel.send("Não existe um próximo áudio na fila para ser reproduzido!");
    }
}
const servers = require("../index.js").servers;

module.exports = function(msg) {
    let server = servers[msg.guild.id];

    server.loopEnabled = !server.loopEnabled;

    let status = server.loopEnabled ? "ligado" : "desligado";
    msg.channel.send(`Loop ${status}.`);    
}
const servers = require("../index.js").servers;

module.exports = function(msg) {
    servers[msg.guild.id].loopEnabled = !servers[msg.guild.id].loopEnabled;

    let status = servers[msg.guild.id].loopEnabled ? "ligado" : "desligado";
    msg.channel.send(`Loop ${status}.`);    
}
const servidores = require("../index.js").servidores;

module.exports = function(msg) {
    servidores.server.loopEnabled = !servidores.server.loopEnabled;

    let status = servidores.server.loopEnabled ? "ligado" : "desligado";
    msg.channel.send(`Loop ${status}.`);    
}
const Discord = require("discord.js");
const servers = require("../index.js").servers;

module.exports = function(msg) {
    let server = servers[msg.guild.id];

    let queue = server.queue;
    let lista = "";

    // Se houver áudios na queue
    if (server.queue.length >= 1) {
        lista = `**Atualmente tocando:** ${server.queue[server.queuePosition].title}\n`
        + `**Loop** ***${(server.loopEnabled ? "ligado." : "desligado.")}***` + "\n\n"
    }

    if (queue.length == 0) {
        lista = "**Não há músicas na fila.**";
    }

    for (let i = 0; i < queue.length; i++) {
        lista += `${i + 1}) ${queue[i].title}` + " ``["+queue[i].duration+"]``\n";
    }

    let embed = new Discord.MessageEmbed()
        .setColor([0, 191, 255])
        .setTitle("FILA")
        .setDescription(lista)

    msg.channel.send(embed);
}
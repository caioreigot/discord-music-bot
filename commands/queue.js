const Discord = require("discord.js");
const servers = require("../index.js").servers;

module.exports = function(msg) {
    let queue = servers[msg.guild.id].queue;
    let lista = "";

    // Se houver áudios na queue
    if (servers[msg.guild.id].queue.length >= 1) {
        lista = `**Atualmente tocando:** ${servers[msg.guild.id].queue[servers[msg.guild.id].queuePosition].title}\n`
        + `**Loop** ***${(servers[msg.guild.id].loopEnabled ? "ligado." : "desligado.")}***` + "\n\n"
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
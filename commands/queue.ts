import { MessageEmbed as DiscordMessageEmbed } from 'discord.js';
import { Message as DiscordMessage } from 'discord.js';
import { servers } from '../index';
import errorMessages from '../errorMessages.json';
import Server from '../model/Server';
import QueueObject from '../model/QueueObject';

export default function queue(msg: DiscordMessage) {
    if (msg.guild == null) {
        msg.channel.send(errorMessages.serverNotIdentified);
        return;
    }

    let server: Server = servers[msg.guild.id];

    let queue: Array<QueueObject> = server.queue;
    let lista: string = "";

    // Se houver áudios na queue
    if (server.queue.length >= 1) {
        lista = `**Atualmente tocando:** ${server.queue[server.queuePosition].title} `
        + `**[Posição #${server.queuePosition}]**\n`
        + `**Loop** ***${(server.loopEnabled ? "ligado." : "desligado.")}***` + "\n\n"
    }

    if (queue.length == 0) {
        lista = "**Não há músicas na fila.**";
    }

    for (let i = 0; i < queue.length; i++) {
        lista += `${i + 1}) ${queue[i].title}` + " ``["+queue[i].duration+"]``\n";
    }

    let embed: DiscordMessageEmbed = new DiscordMessageEmbed()
        .setColor([0, 191, 255])
        .setTitle("FILA")
        .setDescription(lista)

    msg.channel.send(embed);
}
import { Message as DiscordMessage } from 'discord.js';
import { servers } from '../index';
import Server from '../model/Server';
import errorMessages from '../errorMessages.json';

export function next(msg: DiscordMessage) {
    if (msg.guild == null) {
        msg.channel.send(errorMessages.serverNotIdentified);
        return;
    }

    let server: Server = servers[msg.guild.id];

    // Se houver próximo áudio na queue
    if (server.queuePosition + 1 < server.queue.length && server.dispatcher != null) {
        server.dispatcher.end();
        msg.channel.send("Áudio atual pulado.");
    } else {
        msg.channel.send(errorMessages.noNextAudio);
    }
}
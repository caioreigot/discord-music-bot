import { Message as DiscordMessage } from 'discord.js';
import { servers, hasNextAudio } from '../index';
import Server from '../model/Server';
import errorMessages from '../errorMessages.json';
import successMessages from '../successMessages.json';

export default function clear(msg: DiscordMessage) {
    if (msg.guild == null) {
        msg.channel.send(errorMessages.serverNotIdentified);
        return;
    }

    const server: Server = servers[msg.guild.id]; 

    server.dispatcher?.destroy();
    server.dispatcher = null;
    server.currentVideoUrl = null;
    server.queue = [];
    server.queuePosition = 0;
    server.hasNextAudio = hasNextAudio(server);

    msg.channel.send(successMessages.queueCleared);
}
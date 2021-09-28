import { Message as DiscordMessage } from 'discord.js';
import { servers } from '../index.js';
import Server from '../model/Server';
import errorMessages from '../errorMessages.json';
import successMessages from '../successMessages.json';

export default function pause(msg: DiscordMessage) {
    if (msg.guild == null) {
        msg.channel.send(errorMessages.serverNotIdentified);
        return;
    }
    
    let server: Server = servers[msg.guild.id];

    if (!server.paused) {
        if (server.dispatcher != null) {
            server.dispatcher.pause();
            server.paused = true;
            msg.channel.send(successMessages.audioPaused);
        }
    } else {
        msg.channel.send(errorMessages.audioAlreadyPaused);
    }
}
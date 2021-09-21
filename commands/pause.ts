import { Message as DiscordMessage } from 'discord.js';
import Server from '../model/Server';
const servers = require("../index.js").servers;
import errorMessages from '../errorMessages.json';

export function pause(msg: DiscordMessage) {
    if (msg.guild == null) {
        msg.channel.send(errorMessages.serverNotIdentified);
        return;
    }
    
    let server: Server = servers[msg.guild.id];

    if (!server.paused) {
        if (server.dispatcher != null) {
            server.dispatcher.pause();
            server.paused = true;
            msg.channel.send("Áudio pausado! Escreva **!resume** para despausar.");
        }
    } else {
        msg.channel.send(errorMessages.audioAlreadyPaused);
    }
}
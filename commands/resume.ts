import { Message as DiscordMessage } from 'discord.js';
import { servers } from '../index';
import Server from '../model/Server';
import errorMessages from '../errorMessages.json';
import successMessages from '../successMessages.json'

export function resume(msg: DiscordMessage) {
    if (msg.guild == null) {
        msg.channel.send(errorMessages.serverNotIdentified);
        return;
    }

    let server: Server = servers[msg.guild.id];

    if (server.paused) {
        if (server.dispatcher == null) return;
        /* 
        * Devido a um bug na versão atual do Node.js, 
        * é preciso resumir, pausar e resumir novamente o player
        * para que o método "resume" funcione devidamente
        */
        server.dispatcher.resume();
        server.dispatcher.pause();
        server.dispatcher.resume();
        server.paused = false;
        msg.channel.send(successMessages.audioResumed);
    } else {
        msg.channel.send(errorMessages.audioAlreadyUnpaused);
    }
}
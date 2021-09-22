import { Message as DiscordMessage } from 'discord.js';
import { servers } from '../index';
import errorMessages from '../errorMessages.json';
import Player from '../functionalities/playAudio';
import Server from '../model/Server';

export function loop(msg: DiscordMessage) {
    if (msg.guild == null) {
        msg.channel.send(errorMessages.serverNotIdentified);
        return;
    }

    let server: Server = servers[msg.guild.id];

    server.loopEnabled = !server.loopEnabled;

    let status = server.loopEnabled ? "ligado" : "desligado";
    msg.channel.send(`Loop ${status}.`);
    
    // Se o loop foi ativado sem ter próximo áudio/nenhum áudio tocando
    if (server.loopEnabled && !server.hasNextAudio && server.dispatcher == null) {
        if (server.queue[server.queuePosition] == undefined) return;
        
        const player: Player = new Player(server);

        server.queuePosition = 0;
        player.playAudio(
            msg.channel,
            server.queue[server.queuePosition].url, 
            server.queue[server.queuePosition].title,
            server.queue[server.queuePosition].duration
        );
    }
}
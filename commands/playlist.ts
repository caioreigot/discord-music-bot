import errorMessages from '../errorMessages.json';
import { Message as DiscordMessage } from 'discord.js';
import { servers } from '../index';
import Server from '../model/Server';

export default function playlist(msg: DiscordMessage) {
    if (msg.guild == null) {
        msg.channel.send(errorMessages.serverNotIdentified);
        return;
    }

    let server: Server = servers[msg.guild.id];

    server.allowPlaylist = !server.allowPlaylist;

    let status = server.allowPlaylist ? "ligada" : "desligada";
    msg.channel.send(`Opção para tocar playlists ${status}.`);
}
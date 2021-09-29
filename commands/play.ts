import ytdl from 'ytdl-core';
import { Message as DiscordMessage } from 'discord.js';
import { servers, assignConnection, saveAndLoadServer } from '../index';
import getYoutubeVideoUrl from '../functionalities/getYoutubeVideoUrl';
import errorMessages from '../errorMessages.json';
import Player from '../functionalities/playAudio';
import Server from '../model/Server';

export default async function play(msg: DiscordMessage) {
    if (msg.guild == null) {
        msg.channel.send(errorMessages.serverNotIdentified);
        return;
    }

    let server: Server = servers[msg.guild.id];

    if (server === undefined) {
        saveAndLoadServer(msg);
    }

    // Se o usuário deu o comando !p sem o bot estar conectado no canal de voz
    if (server.connection === null || 
        server.connection?.channel != msg.member?.voice.channel 
    ) {
        // Conectar no canal de voz
        await assignConnection(msg);

        // Se a conexão ainda for "null", retorne
        if (server.connection === null) return;
    }

    const player: Player = new Player(server);
    let input: string = msg.content.slice(3);

    // Verificar se é uma URL
    if (ytdl.validateURL(input)) {
        player.playRequest(input, msg.channel);
    } else {
        getYoutubeVideoUrl(input, msg, server.allowPlaylist, (url: string) => new Promise(
            async function(resolve, reject) {
                let success: boolean = await player.playRequest(url, msg.channel);
                
                if (success) resolve();
                else reject();
            }
        ));
    }
}
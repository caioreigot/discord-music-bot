import ytdl from 'ytdl-core';
import { Message as DiscordMessage } from 'discord.js';
import { servers, assignConnection, saveAndLoadServer } from '../index';
import getYoutubeVideoUrl from '../functionalities/getYoutubeVideoUrl';
import errorMessages from '../errorMessages.json';
import Player from '../functionalities/playAudio';

export async function play(msg: DiscordMessage) {
    if (msg.guild == null) {
        msg.channel.send(errorMessages.serverNotIdentified);
        return;
    }

    if (servers[msg.guild.id] === undefined) {
        saveAndLoadServer(msg);
    }

    // Se o usuário deu o comando !p sem o bot estar conectado no canal de voz
    if (servers[msg.guild.id].connection === null || 
        servers[msg.guild.id].connection?.channel != msg.member?.voice.channel 
    ) {
        // Conectar no canal de voz
        await assignConnection(msg);

        // Se a conexão ainda for "null", retorne
        if (servers[msg.guild.id].connection === null) return;
    }

    const player: Player = new Player(servers[msg.guild.id]);
    let input: string = msg.content.slice(3);
    
    // Verificar se é uma URL
    if (ytdl.validateURL(input)) {
        player.playRequest(input, msg.channel);
    } else {
        // O input não é uma URL, então procurar no Youtube pelo nome
        getYoutubeVideoUrl(input, msg.channel, (url) => {
            player.playRequest(url, msg.channel);
        });
    }
}
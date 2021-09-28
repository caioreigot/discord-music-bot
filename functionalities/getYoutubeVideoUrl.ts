import { Message as DiscordMessage } from 'discord.js';
import { servers } from '../index';
import errorMessages from '../errorMessages.json';
import successMessages from '../successMessages.json';
const ytSearch = require('youtube-search-api');

export default async function getYoutubeVideoUrl(
    input: string, 
    msg: DiscordMessage,
    allowPlaylist: boolean = true,
    callback: (url: string) => Promise<void>
) {
    try {
        if (msg.guild == null) {
            msg.channel.send(errorMessages.serverNotIdentified);
            return;
        }

        let data = await ytSearch.GetListByKeyword(input, allowPlaylist);
        
        if (data.items.length == 0) {
            let message = servers[msg.guild.id].allowPlaylist 
                ? errorMessages.noResults : errorMessages.noResultsMaybePlaylist;
            
            msg.channel.send(message);
            return;
        }

        const firstResult = data.items[0];

        if (firstResult.type == "video") {
            callback(`https://www.youtube.com/watch?v=${firstResult.id}`);
        } else if (firstResult.type == "playlist") {
            msg.channel.send(successMessages.playlistBeingAdded);
            let playlistData = await ytSearch.GetPlaylistData(firstResult.id);
            
            for (let i = 0; i < playlistData.items.length; i++) {
                if (servers[msg.guild.id].connection != null) {
                    // Usando o "await" para esperar antes de ir para próxima iteração
                    await callback(`https://www.youtube.com/watch?v=${playlistData.items[i].id}`);
                } else { // Se a "connection" for igual a "null", o bot não está mais no canal de voz
                    // Parar de adicionar as músicas à queue quebrando o loop
                    break;
                }
            }
        }
    } catch (err) {
        msg.channel.send(
            errorMessages.playAudioUnknownError +
            "```"+err+"```"
        )
    }
}
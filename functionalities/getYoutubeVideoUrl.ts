import { TextChannel, DMChannel, NewsChannel } from 'discord.js';
import { GlobalOptions } from 'googleapis-common';
import errorMessages from '../errorMessages.json';
const ytSearch = require('youtube-search-api');
import * as google from 'googleapis';

const youtube = new google.youtube_v3.Youtube({
    version: "v3",
    auth: process.env.GOOGLE_KEY
} as GlobalOptions);

export default async function getYoutubeVideoUrl(
    input: string, 
    channel: TextChannel | DMChannel | NewsChannel, 
    callback: (url: string) => void
) {
    /*
    * API da Google que fornece o ID do vídeo no Youtube, para então 
    * conseguir dar play através da concatenação no URL
    */
    try {
        youtube.search.list({
            q: input,
            part: ["snippet"],
            fields: "items(id(videoId), snippet(title,channelTitle))",
            type: ["video"]
        }, function (err, resultado: any) {
            if (err) {
                alternativeSearch(input, channel, callback);
                return;
            }

            else if (resultado) {
                let videoId = resultado.data.items[0].id.videoId;
                callback(`https://www.youtube.com/watch?v=${videoId}`);
            }
        });
    } catch (err) {
        console.warn(err);
        alternativeSearch(input, channel, callback);
    }
}

// Pesquisa no Youtube sem a API da Google
const alternativeSearch = async (
    input: string, 
    channel: TextChannel | DMChannel | NewsChannel, 
    callback: (url: string) => void 
) => {
    try {
        let data = await ytSearch.GetListByKeyword(input, false);
        let firstVideoId = data.items[0].id;
        let link = `https://www.youtube.com/watch?v=${firstVideoId}`;
        callback(link);
    } catch (err) {
        channel.send(
            errorMessages.playAudioUnknownError +
            "```"+err+"```"
        )
    }
}
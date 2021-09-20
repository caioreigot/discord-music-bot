const config = require("../config.json");
const google = require("googleapis");
const yt = require("youtube-search-without-api-key");

const youtube = new google.youtube_v3.Youtube({
    version: "v3",
    auth: config.GOOGLE_KEY
});

module.exports = async (input, channel, callback) => {
    /*
     * API da Google que fornece o ID do vídeo no Youtube, para então 
     * conseguir dar play através da concatenação no URL
    */

    youtube.search.list({
        q: input,
        part: "snippet",
        fields: "items(id(videoId), snippet(title,channelTitle))",
        type: "video"
    }, function (err, resultado) {
        if (err) {
            alternativeSearch(input, channel, callback);
            return;
        }
    
        else if (resultado) {
            let videoId = resultado.data.items[0].id.videoId;
            /*let title = resultado.data.items[0].snippet.title*/

            let link = `https://www.youtube.com/watch?v=${videoId}`;
            callback(link);
        }
    });
}

async function alternativeSearch(input, channel, callback) {
    try {
        const videos = await yt.search(input);
        // Pegando o primeiro objeto do Array (primeiro resultado da pesquisa no Youtube)
        let videoId = videos[0].id.videoId;
        let link = `https://www.youtube.com/watch?v=${videoId}`;
        callback(link);
    } catch (err) {
        channel.send(
            "Um erro foi encontrado ao tentar tocar a música...\n" +
            "```"+err.message+"```"
        )
    }
}
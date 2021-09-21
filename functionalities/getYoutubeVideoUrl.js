require("dotenv/config");
const google = require("googleapis");
const ytSearch = require("youtube-search-api");

const youtube = new google.youtube_v3.Youtube({
    version: "v3",
    auth: process.env.GOOGLE_KEY
});

module.exports = async (input, channel, callback) => {
    /*
    * API da Google que fornece o ID do vídeo no Youtube, para então 
    * conseguir dar play através da concatenação no URL
    */
    try {
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
                callback(`https://www.youtube.com/watch?v=${videoId}`);
            }
        });
    } catch (err) {
        console.warn(err);
        alternativeSearch(input, channel, callback);
    }
}

// Pesquisa no Youtube sem a API da Google
const alternativeSearch = async (input, channel, callback) => {
    try {
        let data = await ytSearch.GetListByKeyword(input, false);
        let firstVideoId = data.items[0].id;
        let link = `https://www.youtube.com/watch?v=${firstVideoId}`;
        callback(link);
    } catch (err) {
        channel.send(
            "Um erro foi encontrado ao tentar tocar a música...\n" +
            "```"+err.message+"```"
        )
    }
}
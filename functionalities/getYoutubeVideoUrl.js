const config = require("../config.json");
const google = require("googleapis");

const youtube = new google.youtube_v3.Youtube({
    version: "v3",
    auth: config.GOOGLE_KEY
});

module.exports = (input, channel, callback) => {
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
            channel.send(
                "Um erro foi encontrado ao tentar tocar a música...\n" +
                "```"+err.message+"```"
            )
            
            return null;
        }
    
        else if (resultado) {
            let videoId = resultado.data.items[0].id.videoId;
            /*let title = resultado.data.items[0].snippet.title*/;

            let link = `https://www.youtube.com/watch?v=${videoId}`;
            callback(link);
        }
    });
}
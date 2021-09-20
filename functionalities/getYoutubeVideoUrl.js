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
            if (err.message == 'The request cannot be completed because you have exceeded your <a href="/youtube/v3/getting-started#quota">quota</a>.') {
                channel.send(
                    "Ops! Infelizmente o Bot tem um limite de pesquisas no Youtube por dia, por favor, use o link para tocar o áudio ao invés de usar um nome.\n``!p <link>``"
                )
            } else {
                channel.send(
                    "Um erro foi encontrado ao tentar tocar a música...\n" +
                    "```"+err.message+"```"
                )
            }

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
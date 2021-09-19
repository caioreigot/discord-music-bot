/*
 * TODO: Linha 21 e 30
*/

const QueueObject = require("../model/QueueObject");
const convertToMinutes = require("./convertToMinutes");
const config = require("../config.json");

function Player(ytdl, server) {
    this.ytdl = ytdl;
    this.server = server;
};

Player.prototype.playRequest = function(url, channel) {
    // Pegando as informações do vídeo para mostrar o título no chat
    this.ytdl.getInfo(url).then(info => {
        const videoTitle = info.videoDetails.title;
        const videoDurationInMinutes = convertToMinutes(info.videoDetails.lengthSeconds);

        this.server.queue.push(
            new QueueObject(
                url, `${videoTitle} [${videoDurationInMinutes}]`
            )
        );

        let status = (url == this.server.currentVideoUrl) ? "Tocando" : "Adicionado à fila"
        channel.send(`${status}: **${videoTitle}** [${videoDurationInMinutes}]`);
    });

    if (this.server.dispatcher == null) {        
        this.playCurrentAudio(url);
    }
};

Player.prototype.playCurrentAudio = function(url) {
    this.server.dispatcher = this.server.connection.play(
        this.ytdl(url, config.YTDL).on("finish", () => {
            /* TODO?: Download completo */
        })
    ).on("finish", () => { // Audio atual terminou
        let queuePosition = this.server.queuePosition;
        let queueLength = this.server.queue.length;

        if (queueLength > 1 && queuePosition + 1 <= queueLength) {
            this.server.queuePosition++;
            this.server.dispatcher = null;
            this.playCurrentAudio(this.server.queue[this.server.queuePosition]);
        }
    });

    this.server.currentVideoUrl = url;
}

module.exports = Player;
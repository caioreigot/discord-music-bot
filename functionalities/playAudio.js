/*
 * TODO: Linha 21 e 30
*/

const config = require("../config.json");

function Player(ytdl, server) {
    this.ytdl = ytdl;
    this.server = server;
};

Player.prototype.playRequest = function(url, channel) {
    this.server.queue.push(url);

    if (this.server.dispatcher == null) {        
        this.playCurrentAudio(url);
    }

    // Pegando as informações do vídeo para mostrar o título no chat
    this.ytdl.getInfo(url).then(info => {
        let status = (url == this.server.currentVideoUrl) ? "Tocando" : "Adicionado à fila"
        channel.send(`${status}: **${info.videoDetails.title}**`);

        /*
         * TODO: Adicionar no array server.queue objetos com 2 valores, um pro link e
         * outro pro título + duração do vídeo (para aparecer no !queue) 
        */
    });
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
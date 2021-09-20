const QueueObject = require("../model/QueueObject");
const convertToMinutes = require("./convertToMinutes");
const config = require("../config.json");
const hasNextAudio = require("../index.js").hasNextAudio;

function Player(ytdl, server) {
    this.ytdl = ytdl;
    this.server = server;
};

// Função chamada quando um usuário faz uma requisição de áudio, que será adicionado na queue
Player.prototype.playRequest = function(url, channel) {
    // Pegando as informações do vídeo para mostrar o título no chat
    this.ytdl.getInfo(url).then(info => {
        const videoTitle = info.videoDetails.title;
        const audioDuration = convertToMinutes(info.videoDetails.lengthSeconds);
        
        this.server.queue.push(new QueueObject(url, videoTitle, audioDuration));
        this.server.hasNextAudio = hasNextAudio(this.server);
        this.playAudio(channel, url, videoTitle, audioDuration, true);
    });
}

// Função chamada para tocar, diretamente, um áudio, sem adicioná-lo na queue
Player.prototype.playAudio = function(channel, url, videoTitle, audioDuration, isUserRequest = false) {
    /*
     * O código só irá entrar neste bloco "if" se o dispatcher estiver null 
     * (o que indica que não está tocando um áudio) ou o áudio foi removido
     * mas o dispatcher não foi limpo, e esta função foi chamada diretamente
     * pelo código (sem passar o valor true para a boolean "isUserRequest")
    */
    if (this.server.dispatcher == null || !isUserRequest) {
        this.server.dispatcher = this.server.connection.play(
            this.ytdl(url, config.YTDL)/*.on("finish", () => {
                    // Download completo
            })*/
        ).on("finish", () => { // Audio atual terminou
            this.server.dispatcher = null;
        
            // Se houver ainda áudios para reproduzir na queue
            this.server.hasNextAudio = hasNextAudio(this.server);

            if (this.server.hasNextAudio) {
                this.server.queuePosition++;
                this.playAudio(
                    channel,
                    this.server.queue[this.server.queuePosition].url, 
                    this.server.queue[this.server.queuePosition].title,
                    this.server.queue[this.server.queuePosition].duration
                );
            } else { // Se não houver próximo áudio na queue
                if (this.server.loopEnabled) { // Se a opção de loop estiver ativa
                    this.server.queuePosition = 0;
                    this.playAudio(
                        channel,
                        this.server.queue[this.server.queuePosition].url, 
                        this.server.queue[this.server.queuePosition].title,
                        this.server.queue[this.server.queuePosition].duration
                    );
                }
            }
        });
    
        this.server.currentVideoUrl = url;
    }

    this.showPlayerStatus(channel, url, videoTitle, audioDuration);
}

Player.prototype.showPlayerStatus = function(channel, url, videoTitle, audioDuration) {
    let status = (url == this.server.currentVideoUrl) ? "Tocando" : "Adicionado à fila"
    channel.send(`${status}: **${videoTitle}** `+"``["+audioDuration+"]``");
}

module.exports = Player;
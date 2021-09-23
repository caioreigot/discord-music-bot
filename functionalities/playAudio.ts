import ytdl, { downloadOptions } from 'ytdl-core';
import Server from '../model/Server';
import convertToMinutes from './convertToMinutes';
import QueueObject from '../model/QueueObject';
import config from '../config.json';
import errorMessages from '../errorMessages.json';
import { TextChannel, DMChannel, NewsChannel } from 'discord.js';
import { hasNextAudio } from '../index.js';

export default class Player {

    private server: Server;

    constructor(server: Server) {
        this.server = server;
    }

    // Função chamada quando um usuário faz uma requisição de áudio, que será adicionado na queue
    public playRequest = (
        url: string, 
        channel: TextChannel | DMChannel | NewsChannel
    ) => {
        for (let i = 0; i < this.server.queue.length; i++) {
            // Se esse áudio já foi adicionado na queue
            if (this.server.queue[i].url == url) {
                channel.send(errorMessages.audioAlreadyInQueue);
                return;
            }
        }
    
        // Pegando as informações do vídeo para mostrar o título no chat
        ytdl.getInfo(url).then(info => {
            const videoTitle: string = info.videoDetails.title;
            const audioDuration: string = convertToMinutes(info.videoDetails.lengthSeconds);
            
            this.server.queue.push(new QueueObject(url, videoTitle, audioDuration));
            this.server.hasNextAudio = hasNextAudio(this.server);
            this.playAudio(channel, url, videoTitle, audioDuration, true);

            // Mostrar mensagem no chat (status do player)
            let status = (url == this.server.currentVideoUrl) ? "Tocando" : "Adicionado à fila"
            channel.send(`${status}: **${videoTitle}** `+"``["+audioDuration+"]``");
        });
    }

    // Função chamada para tocar, diretamente, um áudio, sem adicioná-lo na queue
    public playAudio = (
        channel: TextChannel | DMChannel | NewsChannel, 
        url: string, 
        videoTitle: string, 
        audioDuration: string, 
        isUserRequest: boolean = false
    ) => {
        /*
        * O código só irá entrar neste bloco "if" se o dispatcher estiver null 
        * (o que indica que não está tocando um áudio) ou o áudio foi removido
        * mas o dispatcher não foi limpo, e esta função foi chamada diretamente
        * pelo código (sem passar o valor true para a boolean "isUserRequest")
        */
        if (this.server.dispatcher == null || !isUserRequest) {
            if (this.server.connection == null) {
                channel.send(errorMessages.playAudioUnknownError);
                return;
            }

            this.server.dispatcher = this.server.connection.play(
                ytdl(url, config.YTDL as downloadOptions)/*.on("finish", () => {
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
                    // Se a opção de loop estiver ativa e houver músicas para tocar
                    if (this.server.loopEnabled && this.server.queue.length > 0) { 
                        this.restartQueue(channel);
                    }
                }
            });

            this.server.currentVideoUrl = url;
        }

        /*
        let status = (url == this.server.currentVideoUrl) ? "Tocando" : "Adicionado à fila"
        channel.send(`${status}: **${videoTitle}** `+"``["+audioDuration+"]``");
        */
    }

    public restartQueue = (channel: TextChannel | DMChannel | NewsChannel) => {
        this.server.queuePosition = 0;
        this.playAudio(
            channel,
            this.server.queue[this.server.queuePosition].url, 
            this.server.queue[this.server.queuePosition].title,
            this.server.queue[this.server.queuePosition].duration
        );
    }
};
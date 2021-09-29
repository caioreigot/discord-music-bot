"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const convertToMinutes_1 = __importDefault(require("./convertToMinutes"));
const QueueObject_1 = __importDefault(require("../model/QueueObject"));
const config_json_1 = __importDefault(require("../config.json"));
const errorMessages_json_1 = __importDefault(require("../errorMessages.json"));
const index_js_1 = require("../index.js");
class Player {
    constructor(server) {
        // Função chamada quando um usuário faz uma requisição de áudio, que será adicionado na queue
        this.playRequest = (url, channel) => __awaiter(this, void 0, void 0, function* () {
            try {
                for (let i = 0; i < this.server.queue.length; i++) {
                    // Se esse áudio já foi adicionado na queue
                    if (this.server.queue[i].url == url) {
                        channel.send(errorMessages_json_1.default.audioAlreadyInQueue);
                        return true;
                    }
                }
                // Pegando as informações do vídeo para mostrar o título no chat
                const info = yield ytdl_core_1.default.getInfo(url);
                const videoTitle = info.videoDetails.title;
                const audioDuration = (0, convertToMinutes_1.default)(info.videoDetails.lengthSeconds);
                this.server.queue.push(new QueueObject_1.default(url, videoTitle, audioDuration));
                this.server.hasNextAudio = (0, index_js_1.hasNextAudio)(this.server);
                this.playAudio(channel, url, true);
                // Mostrar mensagem no chat (status do player)
                let status = (url == this.server.currentVideoUrl) ? "Tocando" : "Adicionado à fila";
                channel.send(`${status}: **${videoTitle}** ` + "``[" + audioDuration + "]``");
                return true;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
        // Função chamada para tocar, diretamente, um áudio, sem adicioná-lo na queue
        this.playAudio = (channel, url, isUserRequest = false) => {
            /*
            * O código só irá entrar neste bloco "if" se o dispatcher estiver null
            * (o que indica que não está tocando um áudio) ou o áudio foi removido
            * mas o dispatcher não foi limpo, e esta função foi chamada diretamente
            * pelo código (sem passar o valor true para a boolean "isUserRequest")
            */
            if (this.server.dispatcher == null || !isUserRequest) {
                if (this.server.connection == null) {
                    channel.send(errorMessages_json_1.default.playAudioUnknownError);
                    return;
                }
                this.server.dispatcher = this.server.connection.play((0, ytdl_core_1.default)(url, config_json_1.default.YTDL) /*.on("finish", () => {
                        // Download completo
                })*/).on("finish", () => {
                    this.server.dispatcher = null;
                    // Se houver ainda áudios para reproduzir na queue
                    this.server.hasNextAudio = (0, index_js_1.hasNextAudio)(this.server);
                    if (this.server.hasNextAudio) {
                        this.server.queuePosition++;
                        this.playAudio(channel, this.server.queue[this.server.queuePosition].url);
                    }
                    else { // Se não houver próximo áudio na queue
                        // Se a opção de loop estiver ativa e houver músicas para tocar
                        if (this.server.loopEnabled && this.server.queue.length > 0) {
                            this.restartQueue(channel);
                        }
                    }
                });
                this.server.currentVideoUrl = url;
            }
        };
        this.restartQueue = (channel) => {
            this.server.queuePosition = 0;
            this.playAudio(channel, this.server.queue[this.server.queuePosition].url);
        };
        this.server = server;
    }
}
exports.default = Player;

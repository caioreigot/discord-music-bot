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
const index_1 = require("../index");
const getYoutubeVideoUrl_1 = __importDefault(require("../functionalities/getYoutubeVideoUrl"));
const errorMessages_json_1 = __importDefault(require("../errorMessages.json"));
const playAudio_1 = __importDefault(require("../functionalities/playAudio"));
function play(msg) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (msg.guild == null) {
            msg.channel.send(errorMessages_json_1.default.serverNotIdentified);
            return;
        }
        let server = index_1.servers[msg.guild.id];
        if (server === undefined) {
            (0, index_1.saveAndLoadServer)(msg);
        }
        // Se o usuário deu o comando !p sem o bot estar conectado no canal de voz
        if (server.connection === null ||
            ((_a = server.connection) === null || _a === void 0 ? void 0 : _a.channel) != ((_b = msg.member) === null || _b === void 0 ? void 0 : _b.voice.channel)) {
            // Conectar no canal de voz
            yield (0, index_1.assignConnection)(msg);
            // Se a conexão ainda for "null", retorne
            if (server.connection === null)
                return;
        }
        const player = new playAudio_1.default(server);
        let input = msg.content.slice(3);
        // Verificar se é uma URL
        if (ytdl_core_1.default.validateURL(input)) {
            player.playRequest(input, msg.channel);
        }
        else {
            (0, getYoutubeVideoUrl_1.default)(input, msg, server.allowPlaylist, (url) => new Promise(function (resolve, reject) {
                return __awaiter(this, void 0, void 0, function* () {
                    let success = yield player.playRequest(url, msg.channel);
                    if (success)
                        resolve();
                    else
                        reject();
                });
            }));
        }
    });
}
exports.default = play;

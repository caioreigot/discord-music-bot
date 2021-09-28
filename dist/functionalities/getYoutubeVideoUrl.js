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
const index_1 = require("../index");
const errorMessages_json_1 = __importDefault(require("../errorMessages.json"));
const successMessages_json_1 = __importDefault(require("../successMessages.json"));
const ytSearch = require('youtube-search-api');
function getYoutubeVideoUrl(input, msg, allowPlaylist = true, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (msg.guild == null) {
                msg.channel.send(errorMessages_json_1.default.serverNotIdentified);
                return;
            }
            let data = yield ytSearch.GetListByKeyword(input, allowPlaylist);
            if (data.items.length == 0) {
                let message = index_1.servers[msg.guild.id].allowPlaylist
                    ? errorMessages_json_1.default.noResults : errorMessages_json_1.default.noResultsMaybePlaylist;
                msg.channel.send(message);
                return;
            }
            const firstResult = data.items[0];
            if (firstResult.type == "video") {
                callback(`https://www.youtube.com/watch?v=${firstResult.id}`);
            }
            else if (firstResult.type == "playlist") {
                msg.channel.send(successMessages_json_1.default.playlistBeingAdded);
                let playlistData = yield ytSearch.GetPlaylistData(firstResult.id);
                for (let i = 0; i < playlistData.items.length; i++) {
                    if (index_1.servers[msg.guild.id].connection != null) {
                        // Usando o "await" para esperar antes de ir para próxima iteração
                        yield callback(`https://www.youtube.com/watch?v=${playlistData.items[i].id}`);
                    }
                    else { // Se a "connection" for igual a "null", o bot não está mais no canal de voz
                        // Parar de adicionar as músicas à queue quebrando o loop
                        break;
                    }
                }
            }
        }
        catch (err) {
            msg.channel.send(errorMessages_json_1.default.playAudioUnknownError +
                "```" + err + "```");
        }
    });
}
exports.default = getYoutubeVideoUrl;

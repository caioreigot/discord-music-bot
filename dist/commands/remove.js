"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = void 0;
const index_1 = require("../index");
const errorMessages_json_1 = __importDefault(require("../errorMessages.json"));
const successMessages_json_1 = __importDefault(require("../successMessages.json"));
function remove(msg) {
    if (msg.guild == null) {
        msg.channel.send(errorMessages_json_1.default.serverNotIdentified);
        return;
    }
    let server = index_1.servers[msg.guild.id];
    let input = msg.content.slice(3);
    let queuePosition = server.queuePosition;
    if (!isInt(input)) {
        msg.channel.send(errorMessages_json_1.default.secondArgumentNotValid);
        return;
    }
    input = parseInt(input);
    if (input > server.queue.length || input <= 0) {
        msg.channel.send(errorMessages_json_1.default.noAudioInThatPosition);
        return;
    }
    // Se remover um áudio que esteja atrás ou à frente na queue
    if (input - 1 < queuePosition || input - 1 > queuePosition) {
        if (input - 1 < queuePosition)
            server.queuePosition--;
        // Remover o áudio requisitado no array "queue"
        server.queue.splice(input - 1, 1);
    }
    // Se remover o áudio atualmente tocando
    if (input - 1 == queuePosition) {
        if (server.dispatcher == null) {
            msg.channel.send(errorMessages_json_1.default.unknownError);
            return;
        }
        // Se o usuário não mandou remover o 1 áudio da lista
        if (input - 1 != 0) {
            server.queuePosition--;
        }
        // Remover o áudio requisitado no array "queue"
        server.queue.splice(input - 1, 1);
        // Encerrando o áudio
        server.dispatcher.end();
    }
    server.hasNextAudio = (0, index_1.hasNextAudio)(server);
    msg.channel.send(successMessages_json_1.default.audioRemoved);
}
exports.remove = remove;
function isInt(value) {
    return !isNaN(value)
        && parseInt(Number(value).toString()) == value
        && !isNaN(parseInt(value, 10));
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const errorMessages_json_1 = __importDefault(require("../errorMessages.json"));
const playAudio_1 = __importDefault(require("../functionalities/playAudio"));
function loop(msg) {
    if (msg.guild == null) {
        msg.channel.send(errorMessages_json_1.default.serverNotIdentified);
        return;
    }
    let server = index_1.servers[msg.guild.id];
    server.loopEnabled = !server.loopEnabled;
    let status = server.loopEnabled ? "ligado" : "desligado";
    msg.channel.send(`Loop ${status}.`);
    // Se o loop foi ativado sem ter próximo áudio/nenhum áudio tocando
    if (server.loopEnabled && !server.hasNextAudio && server.dispatcher == null) {
        if (server.queue[server.queuePosition] == undefined)
            return;
        const player = new playAudio_1.default(server);
        server.queuePosition = 0;
        player.playAudio(msg.channel, server.queue[server.queuePosition].url);
    }
}
exports.default = loop;

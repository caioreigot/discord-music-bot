"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const errorMessages_json_1 = __importDefault(require("../errorMessages.json"));
const successMessages_json_1 = __importDefault(require("../successMessages.json"));
function resume(msg) {
    if (msg.guild == null) {
        msg.channel.send(errorMessages_json_1.default.serverNotIdentified);
        return;
    }
    let server = index_1.servers[msg.guild.id];
    if (server.paused) {
        if (server.dispatcher == null)
            return;
        /*
        * Devido a um bug na versão atual do Node.js,
        * é preciso resumir, pausar e resumir novamente o player
        * para que o método "resume" funcione devidamente
        */
        server.dispatcher.resume();
        server.dispatcher.pause();
        server.dispatcher.resume();
        server.paused = false;
        msg.channel.send(successMessages_json_1.default.audioResumed);
    }
    else {
        msg.channel.send(errorMessages_json_1.default.audioAlreadyUnpaused);
    }
}
exports.default = resume;

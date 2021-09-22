"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pause = void 0;
const servers = require("../index.js").servers;
const errorMessages_json_1 = __importDefault(require("../errorMessages.json"));
function pause(msg) {
    if (msg.guild == null) {
        msg.channel.send(errorMessages_json_1.default.serverNotIdentified);
        return;
    }
    let server = servers[msg.guild.id];
    if (!server.paused) {
        if (server.dispatcher != null) {
            server.dispatcher.pause();
            server.paused = true;
            msg.channel.send("Áudio pausado! Escreva **!resume** para despausar.");
        }
    }
    else {
        msg.channel.send(errorMessages_json_1.default.audioAlreadyPaused);
    }
}
exports.pause = pause;

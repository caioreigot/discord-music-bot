"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const errorMessages_json_1 = __importDefault(require("../errorMessages.json"));
const successMessages_json_1 = __importDefault(require("../successMessages.json"));
function next(msg) {
    if (msg.guild == null) {
        msg.channel.send(errorMessages_json_1.default.serverNotIdentified);
        return;
    }
    let server = index_1.servers[msg.guild.id];
    // Se houver próximo áudio na queue
    if (server.queuePosition + 1 < server.queue.length && server.dispatcher != null) {
        server.dispatcher.end();
        msg.channel.send(successMessages_json_1.default.audioSkipped);
    }
    else {
        msg.channel.send(errorMessages_json_1.default.noNextAudio);
    }
}
exports.default = next;

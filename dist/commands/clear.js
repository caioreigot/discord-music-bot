"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clear = void 0;
const index_1 = require("../index");
const errorMessages_json_1 = __importDefault(require("../errorMessages.json"));
function clear(msg) {
    var _a;
    if (msg.guild == null) {
        msg.channel.send(errorMessages_json_1.default.serverNotIdentified);
        return;
    }
    const server = index_1.servers[msg.guild.id];
    (_a = server.dispatcher) === null || _a === void 0 ? void 0 : _a.destroy();
    server.dispatcher = null;
    server.currentVideoUrl = null;
    server.queue = [];
    server.queuePosition = 0;
    server.hasNextAudio = (0, index_1.hasNextAudio)(server);
    msg.channel.send("Fila limpa.");
}
exports.clear = clear;

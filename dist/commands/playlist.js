"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorMessages_json_1 = __importDefault(require("../errorMessages.json"));
const index_1 = require("../index");
function playlist(msg) {
    if (msg.guild == null) {
        msg.channel.send(errorMessages_json_1.default.serverNotIdentified);
        return;
    }
    let server = index_1.servers[msg.guild.id];
    server.allowPlaylist = !server.allowPlaylist;
    let status = server.allowPlaylist ? "ligada" : "desligada";
    msg.channel.send(`Opção para tocar playlists ${status}.`);
}
exports.default = playlist;

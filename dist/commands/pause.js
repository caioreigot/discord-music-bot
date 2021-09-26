"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pause = void 0;
const index_js_1 = require("../index.js");
const errorMessages_json_1 = __importDefault(require("../errorMessages.json"));
const successMessages_json_1 = __importDefault(require("../successMessages.json"));
function pause(msg) {
    if (msg.guild == null) {
        msg.channel.send(errorMessages_json_1.default.serverNotIdentified);
        return;
    }
    let server = index_js_1.servers[msg.guild.id];
    if (!server.paused) {
        if (server.dispatcher != null) {
            server.dispatcher.pause();
            server.paused = true;
            msg.channel.send(successMessages_json_1.default.audioPaused);
        }
    }
    else {
        msg.channel.send(errorMessages_json_1.default.audioAlreadyPaused);
    }
}
exports.pause = pause;

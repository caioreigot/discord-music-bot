"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leave = void 0;
const index_1 = require("../index");
const errorMessages_json_1 = __importDefault(require("../errorMessages.json"));
function leave(msg) {
    var _a;
    if (((_a = msg.member) === null || _a === void 0 ? void 0 : _a.voice.channel) == null) {
        msg.channel.send(errorMessages_json_1.default.voiceChannelNotIdentified);
        return;
    }
    if (msg.guild == null) {
        msg.channel.send(errorMessages_json_1.default.serverNotIdentified);
        return;
    }
    msg.member.voice.channel.leave();
    (0, index_1.clearServerValues)(msg.guild.id);
}
exports.leave = leave;

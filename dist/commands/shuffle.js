"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const errorMessages_json_1 = __importDefault(require("../errorMessages.json"));
const successMessages_json_1 = __importDefault(require("../successMessages.json"));
function shuffle(msg) {
    if (msg.guild == null) {
        msg.channel.send(errorMessages_json_1.default.serverNotIdentified);
        return;
    }
    let server = index_1.servers[msg.guild.id];
    if (server.queue.length == 0) {
        msg.channel.send(errorMessages_json_1.default.emptyQueue);
        return;
    }
    const queue = server.queue;
    const queuePosition = server.queuePosition;
    shuffleQueue(queue, queuePosition);
    msg.channel.send(successMessages_json_1.default.queueShuffled);
}
exports.default = shuffle;
/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleQueue(array, indexToStay) {
    let itemRemoved = array[indexToStay];
    array.splice(indexToStay, 1);
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    array.splice(indexToStay, 0, itemRemoved);
}

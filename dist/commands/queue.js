"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_1 = require("../index");
const errorMessages_json_1 = __importDefault(require("../errorMessages.json"));
function queue(msg) {
    if (msg.guild == null) {
        msg.channel.send(errorMessages_json_1.default.serverNotIdentified);
        return;
    }
    let server = index_1.servers[msg.guild.id];
    let queue = server.queue;
    let lista = "";
    // Se houver áudios na queue
    if (server.queue.length >= 1) {
        lista = `**Atualmente tocando:** ${server.queue[server.queuePosition].title} `
            + `**[Posição #${server.queuePosition}]**\n`
            + `**Loop** ***${(server.loopEnabled ? "ligado." : "desligado.")}***` + "\n\n";
    }
    if (queue.length == 0) {
        lista = "**Não há músicas na fila.**";
    }
    for (let i = 0; i < queue.length; i++) {
        lista += `${i + 1}) ${queue[i].title}` + " ``[" + queue[i].duration + "]``\n";
    }
    let embed = new discord_js_1.MessageEmbed()
        .setColor([0, 191, 255])
        .setTitle("FILA")
        .setDescription(lista);
    msg.channel.send(embed);
}
exports.default = queue;

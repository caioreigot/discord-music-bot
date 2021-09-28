"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_json_1 = __importDefault(require("../config.json"));
const prefix = config_json_1.default.PREFIX;
function help(msg) {
    let embed = new discord_js_1.MessageEmbed()
        .setColor([0, 191, 255])
        .setTitle("Comandos")
        .setDescription("**" + prefix + "p <nome/link>**\n```Procura e toca o áudio no Youtube. Você pode usar o link ou o nome do vídeo (ao pesquisar por nome, será tocado o primeiro resultado fornecido pelo Youtube)```\n"
        + "**" + prefix + "queue**\n```Mostra a ordem em que os áudios serão reproduzidos e algumas informações adicionais```\n"
        + "**" + prefix + "r <posição>**\n```Remove o áudio da fila na posição especificada```\n"
        + "**" + prefix + "playlist**\n```Se ligado, permite que o bot toque playlists do Youtube.```\n"
        + "**" + prefix + "clear**\n```Limpa a queue de áudios```\n"
        + "**" + prefix + "next**\n```Pula para o próximo áudio na queue```\n"
        + "**" + prefix + "shuffle**\n```Embaralha a ordem dos áudios na fila (o áudio que estiver tocando permanecerá na mesma posição)```\n"
        + "**" + prefix + "loop**\n```Se ligado, ao terminar de reproduzir o último áudio da fila, o bot irá voltar para o primeiro```\n"
        + "**" + prefix + "pause**\n```Pausa o áudio```\n"
        + "**" + prefix + "resume**\n```Despausa o áudio```\n"
        + "**" + prefix + "join**\n```Faz o bot entrar no canal que o membro está```\n"
        + "**" + prefix + "leave**\n```Faz o bot sair do canal de voz que está```\n");
    msg.channel.send(embed);
}
exports.default = help;

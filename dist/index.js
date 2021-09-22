"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasNextAudio = exports.assignConnection = exports.clearServerValues = exports.servers = void 0;
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
const config = __importStar(require("./config.json"));
const Server_1 = __importDefault(require("./model/Server"));
const errorMessages_json_1 = __importDefault(require("./errorMessages.json"));
const discord_js_1 = require("discord.js");
const client = new discord_js_1.Client();
const prefix = config.PREFIX;
const servers = {};
exports.servers = servers;
// Função responsável por rodar a aplicação inteira
const run = () => {
    console.log("Rodando a aplicação...");
    dotenv.config();
    client.on("guildCreate", (guild) => {
        // Salvar o ID do server no "serverList.json"
        saveServer(guild.id);
        // Carregar novamente
        loadServers();
    });
    client.on("ready", () => {
        console.log("O bot está online.");
        loadServers();
    });
    client.on("message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        /* Filtros */
        // Se a mensagem não estiver vindo de um servidor
        if (!msg.guild)
            return;
        // Se a mensagem não começar com o prefixo ou a mensagem vier de um bot
        if (!msg.content.startsWith(prefix) || msg.author.bot)
            return;
        // Se o membro não estiver em um canal de voz ao dar o comando
        if (!((_a = msg.member) === null || _a === void 0 ? void 0 : _a.voice.channel)) {
            msg.channel.send(errorMessages_json_1.default.mustBeConnectedVoiceChannel);
            return;
        }
        /* !p <url/nome> */
        else if (msg.content.startsWith(prefix + "p ")) {
            (0, play_1.play)(msg);
            return;
        }
        /* !join */
        else if (msg.content === prefix + "join") {
            (0, join_1.join)(msg);
            return;
        }
        /* !help */
        else if (msg.content === prefix + "help") {
            (0, help_1.help)(msg);
            return;
        }
        // Se o servidor não foi carregado
        if (servers[msg.guild.id] == null) {
            msg.channel.send(errorMessages_json_1.default.mustBeConnectedVoiceChannel);
            return;
        }
        /* !leave */
        else if (msg.content === prefix + "leave") {
            (0, leave_1.leave)(msg);
            return;
        }
        /* !pause */
        else if (msg.content === prefix + "pause") {
            (0, pause_1.pause)(msg);
            return;
        }
        /* !resume */
        else if (msg.content === prefix + "resume") {
            (0, resume_1.resume)(msg);
            return;
        }
        /* !queue */
        else if (msg.content === prefix + "queue") {
            (0, queue_1.queue)(msg);
            return;
        }
        /* !clear */
        else if (msg.content === prefix + "clear") {
            (0, clear_1.clear)(msg);
            return;
        }
        /* !r <numero> */
        else if (msg.content.startsWith(prefix + "r ")) {
            (0, remove_1.remove)(msg);
            return;
        }
        /* !next */
        else if (msg.content === prefix + "next") {
            (0, next_1.next)(msg);
            return;
        }
        /* !loop */
        else if (msg.content === prefix + "loop") {
            (0, loop_1.loop)(msg);
            return;
        }
        /*
         * Caso o código chegue nessa parte, ele não sofreu nenhum return,
         * portanto, o comando não foi reconhecido
        */
        msg.channel.send(errorMessages_json_1.default.invalidCommand);
    }));
    client.login(process.env.TOKEN_DISCORD);
};
const loadServers = () => {
    fs.readFile("serverList.json", "utf8", (err, data) => {
        if (err) {
            console.log("loadServers() => Erro ao ler arquivo json: " + err);
            return;
        }
        const objData = JSON.parse(data);
        for (let i = 0; i < objData.servers.length; i++) {
            servers[objData.servers[i]] = {
                connection: null,
                dispatcher: null,
                currentVideoUrl: null,
                queue: [],
                queuePosition: 0,
                hasNextAudio: false,
                paused: false,
                loopEnabled: false
            };
        }
    });
};
const saveServer = (id) => {
    fs.readFile("serverList.json", "utf8", (err, data) => {
        if (err) {
            console.log("saveServer(id) => Erro ao ler arquivo json: " + err);
            return;
        }
        const objData = JSON.parse(data);
        // Se o ID do servidor não existir no array
        if (!objData.servers.includes(id)) {
            objData.servers.push(id);
            // Converter os dados do objeto para json novamente 
            const objJson = JSON.stringify(objData);
            // Escrever o novo valor no serverList.json
            fs.writeFile("serverList.json", objJson, "utf8", () => { });
            console.log("ID do servidor salvo no arquivo json.");
        }
    });
};
const clearServerValues = (serverId) => {
    servers[serverId] = new Server_1.default();
};
exports.clearServerValues = clearServerValues;
// Atribui uma connection para o bot (função chamada quando ele se conecta a um voice channel)
const assignConnection = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (msg.guild == null)
            throw new Error(errorMessages_json_1.default.serverNotIdentified);
        if (msg.member == null)
            throw new Error(errorMessages_json_1.default.memberNotIdentified);
        if (msg.member.voice.channel == null)
            throw new Error(errorMessages_json_1.default.voiceChannelNotIdentified);
        let server = servers[msg.guild.id];
        server.connection = yield msg.member.voice.channel.join();
        // Se o bot desconectar, por qualquer motivo, esta função será chamada
        (_a = server.connection) === null || _a === void 0 ? void 0 : _a.on("disconnect", () => {
            if (msg.guild != null)
                clearServerValues(msg.guild.id);
        });
    }
    catch (err) {
        msg.channel.send(errorMessages_json_1.default.playAudioUnknownError +
            "```Log: " + err + "```");
    }
});
exports.assignConnection = assignConnection;
const hasNextAudio = (server) => {
    return server.queuePosition + 1 < server.queue.length;
};
exports.hasNextAudio = hasNextAudio;
/* Commands */
const play_1 = require("./commands/play");
const join_1 = require("./commands/join");
const leave_1 = require("./commands/leave");
const pause_1 = require("./commands/pause");
const resume_1 = require("./commands/resume");
const queue_1 = require("./commands/queue");
const clear_1 = require("./commands/clear");
const remove_1 = require("./commands/remove");
const next_1 = require("./commands/next");
const loop_1 = require("./commands/loop");
const help_1 = require("./commands/help");
// Rodando a aplicação
run();

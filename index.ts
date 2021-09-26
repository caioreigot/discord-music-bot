import * as dotenv from 'dotenv';
import * as fs from 'fs';
import config from './config.json';
import Server from './model/Server';
import errorMessages from './errorMessages.json';
import IServersList from './model/IServersList';

import { 
    Message as DiscordMessage,
    Guild as DiscordGuild, 
    Client as DiscordClient
} from 'discord.js';

const client: DiscordClient = new DiscordClient();
const prefix: string = config.PREFIX;
const servers: IServersList = {};

/* Exportações */
export { 
    servers, 
    clearServerValues, 
    assignConnection, 
    hasNextAudio,
    saveAndLoadServer 
}

/* Commands */
import { play } from './commands/play';
import { join } from './commands/join';
import { leave } from './commands/leave';
import { pause } from './commands/pause';
import { resume } from './commands/resume';
import { queue } from './commands/queue';
import { clear } from './commands/clear';
import { remove } from './commands/remove';
import { next } from './commands/next';
import { shuffle } from './commands/shuffle';
import { loop } from './commands/loop';
import { help } from './commands/help';

// Função responsável por rodar a aplicação inteira
const run = () => {
    console.log("Rodando a aplicação...");

    dotenv.config();

    client.on("guildCreate", (guild: DiscordGuild) => {
        // Salvar o ID do server no "serverList.json"
        saveServer(guild.id);

        // Carregar novamente
        loadServers();
    });

    client.on("ready", () => {
        console.log("O bot está online.");

        client.user?.setActivity(
            `${prefix}help`, { type: "LISTENING" }
        );

        loadServers();    
    });
    
    client.on("message", async (msg: DiscordMessage) => {
        /* Filtros */
        // Se a mensagem não estiver vindo de um servidor
        if (!msg.guild) return;
        // Se a mensagem não começar com o prefixo ou a mensagem vier de um bot
        if (!msg.content.startsWith(prefix) || msg.author.bot) return;
        // Se o membro não estiver em um canal de voz ao dar o comando
        if (!msg.member?.voice.channel) {
            msg.channel.send(errorMessages.mustBeConnectedVoiceChannel);
            return;
        }

        /* prefixo + p <url/nome> */
        else if (msg.content.startsWith(prefix + "p ")) {
            play(msg);
            return;
        }

        /* prefixo + join */
        else if (msg.content === prefix + "join") {
            join(msg);
            return;
        }

        /* prefixo + help */
        else if (msg.content === prefix + "help") {
            help(msg);
            return;
        }

        // Se o servidor não foi carregado
        if (servers[msg.guild.id] == null) {
            msg.channel.send(errorMessages.mustBeConnectedVoiceChannel);
            return;
        }

        /* prefixo + leave */
        else if (msg.content === prefix + "leave") {
            leave(msg);
            return;
        }

        /* prefixo + pause */
        else if (msg.content === prefix + "pause") { 
            pause(msg);
            return;
        }

        /* prefixo + resume */
        else if (msg.content === prefix + "resume") { 
            resume(msg);
            return;
        }

        /* prefixo + queue */
        else if (msg.content === prefix + "queue") {
            queue(msg);
            return;
        }

        /* prefixo + clear */
        else if (msg.content === prefix + "clear") {
            clear(msg);
            return;
        }

        /* prefixo + r <numero> */
        else if (msg.content.startsWith(prefix + "r ")) {
            remove(msg);
            return;
        }

        /* prefixo + next */
        else if (msg.content === prefix + "next") {
            next(msg);
            return;
        }

        /* prefixo + shuffle */
        else if (msg.content === prefix + "shuffle") {
            shuffle(msg);
            return;
        }

        /* prefixo + loop */
        else if (msg.content === prefix + "loop") {
            loop(msg);
            return;
        }

        /*
         * Caso o código chegue nessa parte, ele não sofreu nenhum return, 
         * portanto, o comando não foi reconhecido
        */
        msg.channel.send(errorMessages.invalidCommand);
    });
    
    client.login(process.env.TOKEN_DISCORD);
}

const clearServerValues = (serverId: string) => {
    servers[serverId] = new Server();
}

// Atribui uma connection para o bot (função chamada quando ele se conecta a um voice channel)
const assignConnection = async (msg: DiscordMessage) => {
    try {
        if (msg.guild == null) throw new Error(errorMessages.serverNotIdentified);
        if (msg.member == null) throw new Error(errorMessages.memberNotIdentified);
        if (msg.member.voice.channel == null) throw new Error(errorMessages.voiceChannelNotIdentified);

        let server: Server = servers[msg.guild.id];

        if (msg.member.voice.channel.full) {
            msg.channel.send(errorMessages.voiceChannelFull);
            return;
        }

        server.connection = await msg.member.voice.channel.join();

        // Se o bot desconectar, por qualquer motivo, esta função será chamada
        server.connection?.on("disconnect", () => {
            if (msg.guild != null) clearServerValues(msg.guild.id);
        })
    } catch (err) {
        msg.channel.send(
            errorMessages.playAudioUnknownError +
            "```Log: "+err+"```"
        )
    }
}

const saveServer = async (id: string) => {
    try {
        let data: string = fs.readFileSync("serverList.json", "utf8");
        const objData = JSON.parse(data);
        
        // Se o ID do servidor não existir no array
        if (!objData.servers.includes(id)) {
            objData.servers.push(id);

            // Converter os dados do objeto para json novamente 
            const objJson: string = JSON.stringify(objData);
            // Escrever o novo valor no serverList.json
            fs.writeFileSync("serverList.json", objJson, "utf8");

            console.log(`ID ${id} servidor salvo no arquivo json.`);
        }
    } catch (err) {
        console.log("saveServer(id) => Erro ao ler arquivo json: " + err);
        return;
    }
}

const loadServers = () => {
    try {
        let data: string = fs.readFileSync("serverList.json", "utf8");

        const objData = JSON.parse(data);;
    
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
    } catch (err) {
        console.log("loadServers() => Erro ao ler arquivo json: " + err);
        return;
    }
}

const saveAndLoadServer = async (msg: DiscordMessage) => {
    if (msg.guild == null) {
        msg.channel.send(errorMessages.serverNotIdentified);
        return;
    }

    saveServer(msg.guild.id);
    loadServers();
}

const hasNextAudio = (server: Server) => {
    return server.queuePosition + 1 < server.queue.length;
}

// Rodando a aplicação
run();
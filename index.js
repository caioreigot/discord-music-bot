const config = require("./config.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

const prefixo = config.PREFIX;

const servers = [];

// Função responsável por rodar a aplicação inteira
const run = () => {
    console.log("Rodando a aplicação...");

    client.on("guildCreate", (guild) => {
        // Inicializar todas as propriedades do server
        initializeServerObj(guild.id);
    
        // Salvar o ID do server no "serverList.json"
        saveServer(guild.id);
    });
    
    client.on("ready", () => {
        console.log("O bot está online.");
        loadServers();    
    });
    
    client.on("message", async (msg) => {
        /* Filtros */
        // Se a mensagem não estiver vindo de um servidor
        if (!msg.guild) return;
        // Se a mensagem não começar com o prefixo ou a mensagem vier de um bot
        if (!msg.content.startsWith(prefixo) || msg.author.bot) return;
        // Se o membro não estiver em um canal de voz ao dar o comando
        if (!msg.member.voice.channel) { 
            msg.channel.send("Você precisa estar em um canal de voz.");
            return;
        }
    
        /* !p <url/nome> */
        else if (msg.content.startsWith(prefixo + "p ")) {
            play(msg);
            return;
        }
    
        /* !join */
        else if (msg.content === prefixo + "join") {
            join(msg);
            return;
        }

        /* !help */
        else if (msg.content === prefixo + "help") {
            help(msg);
            return;
        }

        // Se o bot não estiver conectado em um servidor
        if (servers[msg.guild.id] == null) {
            msg.channel.send("Você precisa estar conectado em um canal de voz!");
            return;
        }
    
        /* !leave */
        else if (msg.content === prefixo + "leave") {
            leave(msg);
            return;
        }
    
        /* !pause */
        else if (msg.content === prefixo + "pause") { 
            pause(msg);
            return;
        }
    
        /* !resume */
        else if (msg.content === prefixo + "resume") { 
            resume(msg);
            return;
        }
    
        /* !queue */
        else if (msg.content === prefixo + "queue") {
            queue(msg);
            return;
        }
    
        /* !clear */
        else if (msg.content === prefixo + "clear") {
            clear(msg);
            return;
        }
    
        /* !r <numero> */
        else if (msg.content.startsWith(prefixo + "r ")) {
            remove(msg);
            return;
        }
    
        /* !next */
        else if (msg.content === prefixo + "next") {
            next(msg);
            return;
        }
    
        /* !loop */
        else if (msg.content === prefixo + "loop") {
            loop(msg);
            return;
        }
        
        /*
         * Caso o código chegue nessa parte, ele não sofreu nenhum return, 
         * portanto, o comando não foi reconhecido
        */
        msg.channel.send("Comando inválido, escreva **!help** para ver os comandos disponíveis.");
    });
    
    client.login(config.TOKEN_DISCORD);
}

const loadServers = () => {
    fs.readFile("serverList.json", "utf8", (err, data) => {
        if (err) {
            console.log("loadServers() => Erro ao ler arquivo json: " + err);
            return;
        }

        const objData = JSON.parse(data);
        for (let i in objData.servers) {
            servers[i] = {
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
}

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
            fs.writeFile("serverList.json", objJson, "utf8", () => {});

            console.log("ID do servidor salvo no arquivo json.");
        }
    });
}

const clearServerValues = (msg) => {
    server = servers[msg.guild.id];

    with (server) {
        connection = null;
        dispatcher = null;
        currentVideoUrl = null;
        queue = [];
        queuePosition = 0;
        hasNextAudio = false;
        loopEnabled = false;
    }
}

const assignConnection = async (msg) => {
    initializeServerObj(msg.guild.id);
    saveServer(msg.guild.id);

    try {
        servers[msg.guild.id].connection = await msg.member.voice.channel.join();
    
        // Se o bot desconectar, por qualquer motivo, esta função será chamada
        servers[msg.guild.id].connection.on("disconnect", () => {
            clearServerValues(msg);
        })
    } catch (err) {
        msg.channel.send(
            "Um erro foi encontrado ao tentar se juntar ao canal...\n" +
            "```Log: "+err.message+"```"
        )
    }
}

const initializeServerObj = (id) => {
    servers[id] = {
        connection: null,
        dispatcher: null,
        currentVideoUrl: null,
        queue: [],
        queuePosition: 0,
        hasNextAudio: false,
        paused: false,
        loopEnabled: false
    }
}

const hasNextAudio = (server) => {
    return server.queuePosition + 1 < server.queue.length;
}

// Exportações
module.exports = {
    servers, 
    clearServerValues,
    assignConnection,
    hasNextAudio
}

/* Commands */
const play = require("./commands/play");
const join = require("./commands/join");
const leave = require("./commands/leave");
const pause = require("./commands/pause");
const resume = require("./commands/resume");
const queue = require("./commands/queue");
const clear = require("./commands/clear");
const remove = require("./commands/remove");
const next = require("./commands/next");
const loop = require("./commands/loop");
const help = require("./commands/help");

// Rodando a aplicação
run();

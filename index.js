const config = require("./config.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

const prefixo = config.PREFIX;

const servers = [];

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

    /* !d (debug) */
    else if (msg.content === prefixo + "d") {
        console.log("has dispatcher: " + servers[msg.guild.id].dispatcher == null);
        console.log("queue: " + JSON.stringify(servers[msg.guild.id].queue));
        console.log("queuePosition: " + servers[msg.guild.id].queuePosition);
        console.log("hasNextAudio: " + servers[msg.guild.id].hasNextAudio);
        console.log("loopEnabled: " + servers[msg.guild.id].loopEnabled);
        console.log("========================================================");
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

    /* !help */
    else if (msg.content === prefixo + "help") {
        help(msg);
        return;
    }
    
    /*
     * Caso o código chegue nessa parte, ele não sofreu nenhum return, 
     * portanto, o comando não foi reconhecido
    */
    msg.channel.send("Comando inválido, escreva **!help** para ver os comandos disponíveis.");
});

function loadServers() {
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
                loopEnabled: false
            };
        }
    });
}

function saveServer(id) {
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

function clearServerValues(msg) {
    with (servers[msg.guild.id]) {
        connection = null;
        dispatcher = null;
        currentVideoUrl = null;
        queue = [];
        queuePosition = 0;
        hasNextAudio = false;
        loopEnabled = false;
    }
}

async function assignConnection(msg) {
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

function initializeServerObj(id) {
    servers[id] = {
        connection: null,
        dispatcher: null,
        currentVideoUrl: null,
        queue: [],
        queuePosition: 0,
        hasNextAudio: false,
        loopEnabled: false
    }
}

function hasNextAudio(server) {
    return server.queuePosition + 1 < server.queue.length;
}

client.login(config.TOKEN_DISCORD);
const config = require("./config.json");
const Discord = require("discord.js");
const client = new Discord.Client();

const prefixo = config.PREFIX;

const servidores = {
    "server": {
        connection: null,
        dispatcher: null,
        currentVideoUrl: null,
        queue: [],
        queuePosition: 0,
        hasNextAudio: false,
        loopEnabled: false
    }
}

module.exports = {
    servidores, 
    clearServerValues,
    assignConnection
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

client.on("ready", () => {
    console.log("O bot está online.");
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

function clearServerValues() {
    with (servidores.server) {
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
    try {
        servidores.server.connection = await msg.member.voice.channel.join();
    
        // Se o bot desconectar, por qualquer motivo, esta função será chamada
        servidores.server.connection.on("disconnect", () => {
            clearServerValues();
        })
    } catch (err) {
        msg.channel.send(
            "Um erro foi encontrado ao tentar se juntar ao canal...\n" +
            "Log: ```"+err.message+"```"
        )
    }
}

client.login(config.TOKEN_DISCORD);
const config = require("./config.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require("ytdl-core");

const prefixo = config.PREFIX;

const servidores = {
    "server": {
        connection: null,
        dispatcher: null,
        currentVideoUrl: null,
        queue: [],
        queuePosition: 0
    }
};

/* Functionalities */
const getYoutubeVideoUrl = require("./functionalities/getYoutubeVideoUrl");
const playAudio = require("./functionalities/playAudio");
const player = new playAudio(ytdl, servidores.server);

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
        if (servidores.server.connection == null) {
            await assignConnection(msg);
        }

        let input = msg.content.slice(3);
        
        // Verificar se é uma URL
        if (ytdl.validateURL(input)) {
            player.playRequest(input, msg.channel);
        } else {
            // O input não é uma URL, então procurar no Youtube pelo nome
            getYoutubeVideoUrl(input, msg.channel, (url) => {
                player.playRequest(url, msg.channel);
            });
        }

        return;
    }

    /* !join */
    else if (msg.content === prefixo + "join") {
        assignConnection(msg);
        return;
    }

    /* !leave */
    else if (msg.content === prefixo + "leave") {
        msg.member.voice.channel.leave();
        clearServerValues();
        return;
    }

    /* !help */
    else if (msg.content === prefixo + "help") {
        let embed = new Discord.MessageEmbed()
            .setColor([0, 191, 255])
            .setTitle("Comandos")
            .setDescription(
                "**!p <nome/link>**\n```Procura e toca a música no Youtube. Você pode usar o link ou o nome do vídeo (ao pesquisar por nome, será tocado o primeiro resultado fornecido pelo Youtube).```\n"
                + "**!queue**\n```Mostra a ordem que as músicas serão tocadas.```\n"
                + "**!clear**\n```Limpa a queue de músicas.```\n"
                + "**!next**\n```Pula para a próxima música na queue.```\n"
                + "**!pause**\n```Pausa o som.```\n"
                + "**!resume**\n```Despausa o som.```\n"
                + "**!join**\n```Força o Bot a entrar no canal que o membro está.```\n"
                + "**!leave**\n```Faz o Bot sair do canal de voz que está.```\n"
            )

        msg.channel.send(embed);
        return;
    }

    /* !pause */
    else if (msg.content === prefixo + "pause") { 
        servidores.server.dispatcher.pause();
        msg.channel.send("Música pausada! Escreva **!resume** para despausar.");
        return;
    }

    /* !resume */
    else if (msg.content === prefixo + "resume") { 
        resumePlayer();
        msg.channel.send("Música despausada.");
        return;
    }
    
    /*
     * Caso o código chegue nessa parte, ele não sofreu nenhum return, 
     * portanto, o comando não foi reconhecido
    */
    msg.channel.send("Comando não válido, escreva **!help** para ver os comandos disponíveis.");
});

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
            "```"+err.message+"```"
        )
    }
}

function resumePlayer() {
    /* 
     * Devido a um bug na versão atual do Node.js, 
     * é preciso resumir, pausar e resumir novamente o player
     * para que o método "resume" funcione devidamente
    */
    servidores.server.dispatcher.resume();
    servidores.server.dispatcher.pause();
    servidores.server.dispatcher.resume();
}

function clearServerValues() {
    with (servidores.server) {
        connection = null;
        dispatcher = null;
        currentVideoUrl = null;
    }
}

client.login(config.TOKEN_DISCORD);
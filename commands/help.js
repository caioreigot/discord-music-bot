const Discord = require("discord.js");

module.exports = function(msg) {
    let embed = new Discord.MessageEmbed()
        .setColor([0, 191, 255])
        .setTitle("Comandos")
        .setDescription(
            "**!p <nome/link>**\n```Procura e toca o áudio no Youtube. Você pode usar o link ou o nome do vídeo (ao pesquisar por nome, será tocado o primeiro resultado fornecido pelo Youtube).```\n"
            + "**!queue**\n```Mostra a ordem em que os áudios serão reproduzidos.```\n"
            + "**!r <posição>**\n```Remove o áudio da fila na posição especificada.```\n"
            + "**!clear**\n```Limpa a queue de áudios.```\n"
            + "**!next**\n```Pula para o próximo áudio na queue.```\n"
            + "**!loop**\n```Ao terminar de reproduzir o último áudio da fila, o Bot irá voltar para o primeiro```\n"
            + "**!pause**\n```Pausa o áudio.```\n"
            + "**!resume**\n```Despausa o áudio.```\n"
            + "**!join**\n```Faz o Bot entrar no canal que o membro está.```\n"
            + "**!leave**\n```Faz o Bot sair do canal de voz que está.```\n"
        )

    msg.channel.send(embed);
}
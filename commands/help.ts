import { MessageEmbed as DiscordMessageEmbed } from 'discord.js';
import { Message as DiscordMessage } from 'discord.js';
import config from '../config.json';
const prefix: string = config.PREFIX;

export function help(msg: DiscordMessage) {
    let embed: DiscordMessageEmbed = new DiscordMessageEmbed()
        .setColor([0, 191, 255])
        .setTitle("Comandos")
        .setDescription(
            "**"+prefix+"p <nome/link>**\n```Procura e toca o áudio no Youtube. Você pode usar o link ou o nome do vídeo (ao pesquisar por nome, será tocado o primeiro resultado fornecido pelo Youtube)```\n"
            + "**"+prefix+"queue**\n```Mostra a ordem em que os áudios serão reproduzidos e algumas informações adicionais```\n"
            + "**"+prefix+"r <posição>**\n```Remove o áudio da fila na posição especificada```\n"
            + "**"+prefix+"clear**\n```Limpa a queue de áudios```\n"
            + "**"+prefix+"next**\n```Pula para o próximo áudio na queue```\n"
            + "**"+prefix+"shuffle**\n```Embaralha a ordem dos áudios na fila (o áudio que estiver tocando permanecerá na mesma posição)```\n"
            + "**"+prefix+"loop**\n```Ao terminar de reproduzir o último áudio da fila, o Bot irá voltar para o primeiro```\n"
            + "**"+prefix+"pause**\n```Pausa o áudio```\n"
            + "**"+prefix+"resume**\n```Despausa o áudio```\n"
            + "**"+prefix+"join**\n```Faz o bot entrar no canal que o membro está```\n"
            + "**"+prefix+"leave**\n```Faz o bot sair do canal de voz que está```\n"
        )

    msg.channel.send(embed);
}
import { Message as DiscordMessage } from 'discord.js';
import { servers, hasNextAudio } from '../index';
import errorMessages from '../errorMessages.json';
import successMessage from '../successMessages.json';
import Server from '../model/Server';

export function remove(msg: DiscordMessage) {
    if (msg.guild == null) {
        msg.channel.send(errorMessages.serverNotIdentified);
        return;
    }

    let server: Server = servers[msg.guild.id];

    let input: string | number = msg.content.slice(3);
    let queuePosition: number = server.queuePosition;

    if (!isInt(input)) {
        msg.channel.send(errorMessages.secondArgumentNotValid);
        return;
    }

    input = parseInt(input);

    if (input > server.queue.length || input <= 0) {
        msg.channel.send(errorMessages.noAudioInThatPosition);
        return;
    }

    // Se remover um áudio que esteja atrás ou à frente na queue
    if (input - 1 < queuePosition || input - 1 > queuePosition) {
        if (input - 1 < queuePosition) server.queuePosition--;
        
        // Remover o áudio requisitado no array "queue"
        server.queue.splice(input - 1, 1);
    }

    // Se remover o áudio atualmente tocando
    if (input - 1 == queuePosition) {
        if (server.dispatcher == null) {
            msg.channel.send(errorMessages.unknownError);
            return;
        }

        // Se o usuário não mandou remover o 1 áudio da lista
        if (input - 1 != 0) {
            server.queuePosition--;
        }

        // Remover o áudio requisitado no array "queue"
        server.queue.splice(input - 1, 1);
        
        // Encerrando o áudio
        server.dispatcher.end();
    }

    server.hasNextAudio = hasNextAudio(server);

    msg.channel.send(successMessage.audioRemoved);
}

function isInt(value: any): boolean {
    return !isNaN(value) 
    && parseInt(Number(value).toString()) == value
    && !isNaN(parseInt(value, 10));
}
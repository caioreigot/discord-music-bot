import { Message as DiscordMessage } from 'discord.js';
import { servers } from '../index';
import QueueObject from '../model/QueueObject';
import errorMessages from '../errorMessages.json'
import successMessages from '../successMessages.json';
import Server from '../model/Server';

export default function shuffle(msg: DiscordMessage) {
    if (msg.guild == null) {
        msg.channel.send(errorMessages.serverNotIdentified);
        return;
    }

    let server: Server = servers[msg.guild.id];

    if (server.queue.length == 0) {
        msg.channel.send(errorMessages.emptyQueue);
        return;
    }

    const queue: Array<QueueObject> = server.queue;
    const queuePosition: number = server.queuePosition;
    shuffleQueue(queue, queuePosition);

    msg.channel.send(successMessages.queueShuffled);
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleQueue<T>(array: Array<T>, indexToStay: number) {
    let itemRemoved = array[indexToStay]; 
    array.splice(indexToStay, 1);

    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    array.splice(indexToStay, 0, itemRemoved);
}
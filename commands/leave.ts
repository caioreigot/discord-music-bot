import { Message as DiscordMessage } from 'discord.js';
import { clearServerValues } from '../index';
import errorMessages from '../errorMessages.json';

export default function leave(msg: DiscordMessage) {
    if (msg.member?.voice.channel == null) {
        msg.channel.send(errorMessages.voiceChannelNotIdentified);
        return;
    }

    if (msg.guild == null) {
        msg.channel.send(errorMessages.serverNotIdentified);
        return;
    }

    msg.member.voice.channel.leave();
    clearServerValues(msg.guild.id);
}
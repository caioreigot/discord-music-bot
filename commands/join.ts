import { Message as DiscordMessage } from 'discord.js';
import { assignConnection } from '../index';

export function join(msg: DiscordMessage) {
    assignConnection(msg);
}
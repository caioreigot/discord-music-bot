import { Message as DiscordMessage } from 'discord.js';
import { assignConnection } from '../index';

export default function join(msg: DiscordMessage) {
    assignConnection(msg);
}
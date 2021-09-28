import {
    VoiceConnection as DiscordVoiceConnection,
    StreamDispatcher as DiscordStreamDispatcher
} from 'discord.js';

import QueueObject from './QueueObject';

export default class Server {

    public connection: DiscordVoiceConnection | null;
    public dispatcher: DiscordStreamDispatcher | null;
    public currentVideoUrl: string | null;
    public queue: Array<QueueObject>;
    public queuePosition: number;
    public hasNextAudio: boolean;
    public paused: boolean;
    public allowPlaylist: boolean;
    public loopEnabled: boolean;

    constructor() {
        this.connection = null;
        this.dispatcher = null;
        this.currentVideoUrl = null;
        this.queue = [];
        this.queuePosition = 0;
        this.hasNextAudio = false;
        this.paused = false;
        this.allowPlaylist = true;
        this.loopEnabled = false;
    }
}
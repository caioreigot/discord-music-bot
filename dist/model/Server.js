"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Server {
    constructor() {
        this.connection = null;
        this.dispatcher = null;
        this.currentVideoUrl = null;
        this.queue = [];
        this.queuePosition = 0;
        this.hasNextAudio = false;
        this.paused = false;
        this.loopEnabled = false;
    }
}
exports.default = Server;

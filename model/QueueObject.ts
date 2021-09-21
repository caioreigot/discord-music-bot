export default class QueueObject {
    
    public url: string;
    public title: string;
    public duration: string;

    constructor(url: string, title: string, duration: string) {
        this.url = url;
        this.title = title;
        this.duration = duration;
    }
}
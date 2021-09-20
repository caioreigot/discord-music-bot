const servidores = require("../index.js").servidores;
const assignConnection = require("../index.js").assignConnection;
const ytdl = require("ytdl-core");

const getYoutubeVideoUrl = require("../functionalities/getYoutubeVideoUrl");
const playAudio = require("../functionalities/playAudio");
const player = new playAudio(ytdl, servidores.server);

module.exports = async function(msg) {
    if (servidores.server.connection == null) {
        await assignConnection(msg);
    }
    
    let input = msg.content.slice(3);
    
    // Verificar se é uma URL
    if (ytdl.validateURL(input)) {
        player.playRequest(input, msg.channel);
    } else {
        // O input não é uma URL, então procurar no Youtube pelo nome
        getYoutubeVideoUrl(input, msg.channel, (url) => {
            player.playRequest(url, msg.channel);
        });
    }
}
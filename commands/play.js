const servers = require("../index.js").servers;
const assignConnection = require("../index.js").assignConnection;
const ytdl = require("ytdl-core");

const getYoutubeVideoUrl = require("../functionalities/getYoutubeVideoUrl");
const Player = require("../functionalities/playAudio");

module.exports = async function(msg) {
    // Se o usuário deu o comando !p sem o bot estar conectado no canal de voz
    if (servers[msg.guild.id].connection == null) {
        // Conectar no canal de voz
        await assignConnection(msg);
    }

    const player = new Player(ytdl, servers[msg.guild.id]);
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
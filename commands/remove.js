const servers = require("../index.js").servers;
const hasNextAudio = require("../index.js").hasNextAudio;

module.exports = function(msg) {
    let input = msg.content.slice(3);
    let queuePosition = servers[msg.guild.id].queuePosition;

    if (!isInt(input)) {
        msg.channel.send("Segundo argumento não é válido, use apenas números inteiros.");
        return;
    }

    if (input > servers[msg.guild.id].queue.length || input <= 0) {
        msg.channel.send("Não há nenhum áudio nesta posição.");
        return;
    }

    // Se remover um áudio que esteja atrás ou à frente na queue
    if (input - 1 < queuePosition || input - 1 > queuePosition) {
        if (input - 1 < queuePosition) servers[msg.guild.id].queuePosition--;
        
        // Remover o áudio requisitado no array "queue"
        servers[msg.guild.id].queue.splice(input - 1, 1);
    }

    // Se remover o áudio atualmente tocando
    if (input - 1 == queuePosition) {
        // Se o usuário não mandou remover o 1 áudio da lista
        if (input - 1 != 0) {
            servers[msg.guild.id].queuePosition--;
        }

        // Remover o áudio requisitado no array "queue"
        servers[msg.guild.id].queue.splice(input - 1, 1);
        
        // Encerrando o áudio
        servers[msg.guild.id].dispatcher.end();
    }

    servers[msg.guild.id].hasNextAudio = hasNextAudio(servers[msg.guild.id]);
    
    msg.channel.send("Áudio removido!");
}

function isInt(value) {
    return !isNaN(value) 
    && parseInt(Number(value)) == value
    && !isNaN(parseInt(value, 10));
}
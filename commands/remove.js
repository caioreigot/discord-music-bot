const servidores = require("../index.js").servidores;

module.exports = function(msg) {
    let input = msg.content.slice(3);
    let queuePosition = servidores.server.queuePosition;

    if (!isInt(input)) {
        msg.channel.send("Segundo argumento não é válido, use apenas números inteiros.");
        return;
    }

    if (input > servidores.server.queue.length || input <= 0) {
        msg.channel.send("Não há nenhum áudio nesta posição.");
        return;
    }

    // Se remover um áudio que esteja atrás ou à frente na queue
    if (input - 1 < queuePosition || input - 1 > queuePosition) {
        if (input - 1 < queuePosition) servidores.server.queuePosition--;
        
        // Remover o áudio requisitado no array "queue"
        servidores.server.queue.splice(input - 1, 1);
    }

    // Se remover o áudio atualmente tocando
    if (input - 1 == queuePosition) {
        // Se o usuário não mandou remover o 1 áudio da lista
        if (input - 1 != 0) {
            servidores.server.queuePosition--;
        }

        // Remover o áudio requisitado no array "queue"
        servidores.server.queue.splice(input - 1, 1);
        
        // Encerrando o áudio
        servidores.server.dispatcher.end();
    }

    msg.channel.send("Áudio removido!");
}

function isInt(value) {
    return !isNaN(value) 
    && parseInt(Number(value)) == value
    && !isNaN(parseInt(value, 10));
}
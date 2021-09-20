const clearServerValues = require("../index.js").clearServerValues;

module.exports = function(msg) {
    msg.member.voice.channel.leave();
    clearServerValues(msg);
}
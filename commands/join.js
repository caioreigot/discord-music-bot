const assignConnection = require("../index.js").assignConnection;

module.exports = function(msg) {
    assignConnection(msg);
}
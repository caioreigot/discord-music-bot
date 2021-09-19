const convertToMinutes = function(seconds) {
    let minutes = parseInt(Math.floor(parseInt(seconds) / 60));
    let remainingSeconds = parseInt(parseInt(seconds) - minutes * 60);
    return `${minutes}:${remainingSeconds}`;
}

module.exports = convertToMinutes;
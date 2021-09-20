const convertToMinutes = function(seconds) {
    let minutes = parseInt(Math.floor(parseInt(seconds) / 60));
    let remainingSeconds = parseInt(parseInt(seconds) - minutes * 60);

    /* Formatando para dois dígitos (00:00) */
    minutes = minutes.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
    })

    remainingSeconds = remainingSeconds.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
    })

    return (minutes > 59) ? "+59:59" : `${minutes}:${remainingSeconds}`;
}

module.exports = convertToMinutes;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convertToMinutes = function (seconds) {
    let secondsInt = parseInt(seconds);
    let minutes = Math.floor(secondsInt / 60);
    let remainingSeconds = secondsInt - minutes * 60;
    /* Formatando para dois dígitos (00:00) */
    let minutesString = minutes.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
    });
    let remainingSecondsString = remainingSeconds.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
    });
    return (minutes > 59) ? "+59:59" : `${minutesString}:${remainingSecondsString}`;
};
exports.default = convertToMinutes;

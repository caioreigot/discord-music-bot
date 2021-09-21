const convertToMinutes = function(seconds: string): string {
    let secondsInt: number = parseInt(seconds);
    let minutes: number = Math.floor(secondsInt / 60);
    let remainingSeconds: number = secondsInt - minutes * 60;

    /* Formatando para dois dígitos (00:00) */
    let minutesString: string = minutes.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
    })

    let remainingSecondsString: string = remainingSeconds.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
    })

    return (minutes > 59) ? "+59:59" : `${minutesString}:${remainingSecondsString}`;
}

export default convertToMinutes;
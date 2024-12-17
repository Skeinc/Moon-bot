// Получить оставшееся время в формате "Часы:Минуты:Секунды"
export function getTimeRemainingInHMS(date: string, timeZoneOffset: number = 0): string {
    const endTime = new Date(date).getTime() + timeZoneOffset * 60 * 60 * 1000;
    const nowTime = Date.now();
    const differenceTime = Math.max(0, endTime - nowTime);

    const hours = Math.floor(differenceTime / (1000 * 60 * 60));
    const minutes = Math.floor((differenceTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((differenceTime % (1000 * 60)) / 1000);

    return `${hours}:${minutes}:${seconds}`;
}

// Получить оставшееся время в секундах
export function getTimeRemainingInSeconds(date: string, timeZoneOffset: number = 0): number {
    const endTime = new Date(date).getTime() + timeZoneOffset * 60 * 60 * 1000;
    const nowTime = Date.now();
    const differenceTime = Math.max(0, endTime - nowTime);

    return Math.floor(differenceTime / 1000);
}

// Получить оставшееся время в целых днях
export function getTimeRemainingInDays(date: string, timeZoneOffset: number = 0): number {
    const endTime = new Date(date).getTime() + timeZoneOffset * 60 * 60 * 1000;
    const nowTime = Date.now();
    const differenceTime = Math.max(0, endTime - nowTime);

    return Math.floor(differenceTime / (1000 * 60 * 60 * 24));
}
import moment from 'moment-timezone';

// Получить оставшееся время в формате "Часы:Минуты:Секунды"
export function getTimeRemainingInHMS(date: string, timeZone?: string): string {
    const now = timeZone ? moment().tz(timeZone) : moment();
    const end = timeZone ? moment.tz(date, timeZone) : moment(date);
    const duration = moment.duration(end.diff(now));

    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Получить оставшееся время в секундах
export function getTimeRemainingInSeconds(date: string, timeZone?: string): number {
    const now = timeZone ? moment().tz(timeZone) : moment();
    const end = timeZone ? moment.tz(date, timeZone) : moment(date);
    
    return Math.max(0, end.diff(now, 'seconds'));
}

// Получить оставшееся время в целых днях
export function getTimeRemainingInDays(date: string, timeZone?: string): number {
    const now = timeZone ? moment().tz(timeZone) : moment();
    const end = timeZone ? moment.tz(date, timeZone) : moment(date);

    return Math.max(0, end.diff(now, 'days'));
}
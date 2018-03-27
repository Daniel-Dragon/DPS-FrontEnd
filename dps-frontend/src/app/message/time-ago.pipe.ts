import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'timeAgo'})
export class TimePassedPipe implements PipeTransform {
  transform(value: Date): string {
    const msPerDay = 86400000;
    const msPerHour = 3600000;
    const msPerMinute = 60000;
    const msPerSecond = 1000;
    const timePassed = new Date().getTime() - value.getTime();
    const daysPassed = Math.floor(timePassed / msPerDay);
    if (daysPassed > 0) {
        return daysPassed + ' days ago';
    }
    const hoursPassed = Math.floor(timePassed / msPerHour);
    if (hoursPassed > 0) {
        return hoursPassed + ' hours ago';
    }
    const minutesPassed = Math.floor(timePassed / msPerMinute);
    if (minutesPassed > 0) {
        return minutesPassed + ' minutes ago';
    }
    const secondsPassed = Math.floor(timePassed / msPerSecond);
    return secondsPassed + ' seconds ago';
  }
}

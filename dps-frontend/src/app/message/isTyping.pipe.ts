import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'isTyping'})
export class IsTypingPipe implements PipeTransform {
  transform(value: string[]): string {
    let ans = value.join(', and ');
    if (value.length > 1) {
        ans = ans + ' are typing.';
    } else {
        ans = ans + ' is typing.';
    }
    return ans;
  }
}

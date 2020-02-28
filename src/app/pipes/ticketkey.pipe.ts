import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'ticketkey'
})
export class TicketKeyPipe implements PipeTransform {

  transform(tickeyKey: string): string | undefined {
    return tickeyKey.split('-').pop()
  }
}

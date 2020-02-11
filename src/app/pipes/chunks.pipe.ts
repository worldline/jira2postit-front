import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'chunks'
})
export class ChunksPipe implements PipeTransform {

  transform(array: any, chunkSize: number): any {
    return array.reduce((prev, cur, index) => (index % chunkSize) ? prev : prev.concat([array.slice(index, index + chunkSize)]), [])
  }
}

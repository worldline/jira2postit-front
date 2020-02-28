import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class OverlayLoaderService {

  private _loading = false
  loadingStatus: Subject<boolean> = new Subject()

  get loading(): boolean {
    return this._loading
  }

  set loading(value) {
    this._loading = value
    this.loadingStatus.next(value)
  }

  startLoading() {
    this.loading = true
  }

  stopLoading() {
    this.loading = false
  }
}

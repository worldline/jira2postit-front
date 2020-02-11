import { Injectable } from '@angular/core'
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs'
import { OverlayLoaderService } from './overlay-loader/overlay-loader.service'
import { finalize } from 'rxjs/operators'

@Injectable()
export class OverlayLoaderInterceptor implements HttpInterceptor {

  activeRequests = 0

  constructor(private overlayLoaderService: OverlayLoaderService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.activeRequests === 0) {
      this.overlayLoaderService.startLoading()
    }

    this.activeRequests++
    return next.handle(request).pipe(
      finalize(() => {
        this.activeRequests--
        if (this.activeRequests === 0) {
          this.overlayLoaderService.stopLoading()
        }
      })
    )
  }

}

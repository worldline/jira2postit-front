import { Component, OnInit, OnDestroy } from '@angular/core'
import { OverlayLoaderService } from '../../../services/overlay-loader/overlay-loader.service'
import { Subscription } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

@Component({
  selector: 'app-overlay-loader',
  templateUrl: './overlay-loader.component.html',
  styleUrls: ['./overlay-loader.component.css']
})
export class OverlayLoaderComponent implements OnInit, OnDestroy {
  loading = false
  loadingSubscription: Subscription

  constructor(private overlayLoaderService: OverlayLoaderService) {
  }

  ngOnInit() {
    this.loadingSubscription = this.overlayLoaderService.loadingStatus.pipe(
      debounceTime(200)
    ).subscribe((value) => {
      this.loading = value
    })
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe()
  }

}

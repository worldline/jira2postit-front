import { Component, OnInit } from '@angular/core'
import { Router, NavigationStart, NavigationEnd, Event as NavigationEvent } from '@angular/router'
import { LoginService } from '../../services/login/login.service'
import { Location, PopStateEvent } from '@angular/common'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public printingStepLink = '/login'
  private lastPoppedUrl: string | undefined
  private yScrollStack: number[] = []

  constructor(private router: Router, private loginService: LoginService, private location: Location) {
    router.events.forEach((event: NavigationEvent) => {
        // After Navigation
        if (event instanceof NavigationEnd) {
          if (event.url.startsWith('/boards')) {
            this.printingStepLink = event.url
          }
        }
    })
  }

  // scrolls to the top of a page after navigation, if the page is displayed because of a back, restores the previous scroll level
  ngOnInit(): void {
    this.location.subscribe((ev: PopStateEvent) => {
        this.lastPoppedUrl = ev.url
    })
    this.router.events.subscribe((ev: any) => {
        if (ev instanceof NavigationStart) {
            if (ev.url !== this.lastPoppedUrl) {
                this.yScrollStack.push(window.scrollY)
            }
        } else if (ev instanceof NavigationEnd) {
            if (ev.url === this.lastPoppedUrl) {
                this.lastPoppedUrl = undefined
                window.scrollTo(0, this.yScrollStack.pop() || 0)
            } else {
                window.scrollTo(0, 0)
            }
        }
    })
}

  logout(): void {
    this.loginService.logout()
      .subscribe(
        resp => {
          this.loginService.setAuthenticated(false)
          this.printingStepLink = '/login'
        }
      )
  }

  authenticated(): boolean {
    return this.loginService.getAuthenticated()
  }
}

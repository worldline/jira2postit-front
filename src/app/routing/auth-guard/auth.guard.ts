import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { LoginService } from 'src/app/services/login/login.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public loginService: LoginService, public router: Router) {}

  canActivate(): boolean {
    if (!this.loginService.getAuthenticated()) {
      this.router.navigateByUrl('/login')
      return false
    }
    return true
  }
}

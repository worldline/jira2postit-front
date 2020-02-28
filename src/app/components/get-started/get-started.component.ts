import { Component, OnInit } from '@angular/core'
import { LoginService } from '../../services/login/login.service'

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.css']
})
export class GetStartedComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  authenticated(): boolean {
    return this.loginService.getAuthenticated()
  }
}

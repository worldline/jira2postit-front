import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup, Validators} from '@angular/forms'
import { LoginService } from '../../services/login/login.service'
import { Router } from '@angular/router'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup
  submitted = false
  error: string | null = null
  private unsubscribe = new Subject<void>()

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      boardId: ['', [Validators.required, Validators.pattern('\\d+')]]
    })
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls }

  onSubmit(): void {
    this.submitted = true
    this.error = null

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return
    }

    this.login(this.f.username.value, this.f.password.value, this.f.boardId.value)
  }

  login(username: string, password: string, boardId: string): void {
    this.loginService.login(username, password, boardId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        resp => {
          this.loginService.setAuthenticated(true)
          this.loginService.board = resp
          this.router.navigate([`/boards/${resp.id}/configuration`])
        },
        error => {
          this.error = error
          const condition = this.submitted && this.error != null

        }
      )
  }

  // Ensures that when modifying a field after a first submission, the validation is done again only when the user re-submit
  resetSubmission(): void {
    this.submitted = false
  }

  ngOnDestroy() {
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }
}

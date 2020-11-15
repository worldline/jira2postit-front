import { Component } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import { LoginService } from '@services/login/login.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup
  submitted = false
  error: string | null = null

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

  get username(): FormControl {
    return this.loginForm.get('username') as FormControl
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl
  }

  get boardId(): FormControl {
    return this.loginForm.get('boardId') as FormControl
  }

  onSubmit(): void {
    this.submitted = true
    this.error = null
    if (this.loginForm.invalid) {
      return
    }

    this.loginService.login(this.username.value as string, this.password.value as string, this.boardId.value as string)
      .subscribe(
        resp => {
          this.router.navigate([`/boards/${resp.id}/configuration`])
        },
        error => {
          this.error = error
        }
      )
  }

  // Ensures that when modifying a field after a first submission, the validation is done again only when the user re-submit
  resetSubmission(): void {
    this.submitted = false
  }
}

import { Component, OnInit, Input } from '@angular/core'
import { Step } from './step'
import { LoginService } from '@services/login/login.service'
import { BoardType } from '@services/login/board'
import { Router } from '@angular/router'

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent {
  @Input() activeStep: Step | undefined
  steps: Step[]
  constructor(private loginService: LoginService,
              private router: Router) {
    if (this.loginService.board && this.loginService.board.type === BoardType.Scrum) {
      this.steps = [Step.CONFIGURATION, Step.SPRINTS, Step.PRINTING]
    } else {
      this.steps = [Step.CONFIGURATION, Step.ISSUES, Step.PRINTING]
    }
  }

  navigate(step: Step) {
    if (this.activeStep && step.index < this.activeStep.index && this.loginService.board) {
      if (step === Step.CONFIGURATION) {
        this.router.navigate([`/boards/${this.loginService.board.id}/configuration`])
      } else if (step === Step.ISSUES) {
        this.router.navigate([`/boards/${this.loginService.board.id}/issues`])
      } else if (step === Step.SPRINTS) {
        this.router.navigate([`/boards/${this.loginService.board.id}/sprints`])
      }
    }
  }
}

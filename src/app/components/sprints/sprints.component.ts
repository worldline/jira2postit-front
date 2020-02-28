import { Component, OnInit } from '@angular/core'
import { SprintService } from '../../services/sprints/sprint.service'
import { ScrumIssuesService } from 'src/app/services/scrum-issues/scrum-issues.service'
import { LoginService } from '../../services/login/login.service'
import { PrintingConfigurationService } from '../../services/printing-configuration/printing-configuration.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Sprint } from '../../services/sprints/sprint'
import { Board } from '../../services/login/board'
import { Step } from '../progress-bar/step'
import { SprintResponse } from 'src/app/services/sprints/sprint-response'

@Component({
  selector: 'app-sprints',
  templateUrl: './sprints.component.html',
  styleUrls: ['./sprints.component.css']
})
export class SprintsComponent implements OnInit {
  board: Board | null
  boardId: string | null
  sprints: Sprint[] = []
  selectedSprint: Sprint | null = null
  step = Step.SPRINTS

  constructor(
    private sprintService: SprintService,
    private issuesService: ScrumIssuesService,
    private loginService: LoginService,
    private printingConfigurationService: PrintingConfigurationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.board = this.loginService.board
    this.boardId = this.route.snapshot.paramMap.get('boardId')
  }

  ngOnInit(): void {
    this.getSprints()
  }

  getSprints(): void {
    if (this.boardId) {
      this.sprintService.getSprints(this.boardId)
        .subscribe({
          next: (sprintResponse: SprintResponse): Sprint[] => this.sprints = sprintResponse.values
        })
    }
  }

  onSelect(sprint: Sprint): void {
    this.selectedSprint = sprint
    this.issuesService.sprint = sprint
    this.getIssues(`${this.boardId}`, `${sprint.id}`)
  }

  getIssues(boardId: string, sprintId: string): void {
    this.issuesService.getIssues(boardId, sprintId)
      .subscribe(issues => {
        const toPrintIssues = issues
          .filter(issue => this.printingConfigurationService.getCurrentPrintableIssueTypes()
            .includes(issue.type)
          )
        this.printingConfigurationService.updateToPrintIssues(toPrintIssues)
        this.router.navigate([`/boards/${this.boardId}/formattedTickets`])
    })
  }
}

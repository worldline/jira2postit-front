import { Component, OnInit } from '@angular/core';
import { SprintService } from '../../services/sprints/sprint.service';
import { ScrumIssuesService } from 'src/app/services/scrum-issues/scrum-issues.service';
import { LoginService } from '../../services/login/login.service';
import { PrintingConfigurationService } from '../../services/printing-configuration/printing-configuration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Sprint } from '../../services/sprints/sprint';
import { Board } from '../../services/login/board';
import { Step } from '../progress-bar/step';

@Component({
  selector: 'app-sprints',
  templateUrl: './sprints.component.html',
  styleUrls: ['./sprints.component.css']
})
export class SprintsComponent implements OnInit {
  board: Board;
  sprints: Sprint[];
  selectedSprint: Sprint;
  step = Step.SPRINTS;

  constructor(
    private sprintService: SprintService,
    private issuesService: ScrumIssuesService,
    private loginService: LoginService,
    private printingConfigurationService: PrintingConfigurationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.board = this.loginService.board;
    this.getSprints();
  }

  getSprints(): void {
    this.sprintService.getSprints(this.route.snapshot.paramMap.get('boardId'))
      .subscribe(sprintResponse =>
        this.sprints = sprintResponse.values
      );
  }

  onSelect(sprint: Sprint): void {
    this.selectedSprint = sprint;
    this.issuesService.sprint = sprint;
    this.getIssues(`${this.board.id}`, `${sprint.id}`);
  }

  getIssues(boardId: string, sprintId: string): void {
    this.issuesService.getIssues(boardId, sprintId)
      .subscribe(issues => {
        const toPrintIssues = issues
          .filter(issue => this.printingConfigurationService.getCurrentPrintableIssueTypes()
            .includes(issue.type)
          );
        this.printingConfigurationService.updateToPrintIssues(toPrintIssues);
        this.router.navigate([`/boards/${this.board.id}/formattedTickets`]);
    });
  }
}

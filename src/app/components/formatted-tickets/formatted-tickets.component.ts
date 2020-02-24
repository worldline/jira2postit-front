import { Component, OnInit, OnDestroy } from '@angular/core'
import { ScrumIssuesService } from '../../services/scrum-issues/scrum-issues.service'
import { ActivatedRoute } from '@angular/router'
import { Issue } from '../../services/scrum-issues/issue'
import { PrintingConfigurationService } from '../../services/printing-configuration/printing-configuration.service'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { Step } from '../progress-bar/step'

@Component({
  selector: 'app-formatted-tickets',
  templateUrl: './formatted-tickets.component.html',
  styleUrls: ['./formatted-tickets.component.css']
})

export class FormattedTicketsComponent implements OnInit, OnDestroy {
  sprintName: string
  smallPostitIssues: Issue[][] = []
  fullPostitIssues: Issue[] = []
  isTimeTracked = false
  isComponentGrouped = false
  step = Step.PRINTING
  private unsubscribe = new Subject<void>()

  constructor(
    private issuesService: ScrumIssuesService,
    private printingConfigurationService: PrintingConfigurationService,
    private route: ActivatedRoute
  ) {
    this.sprintName = this.issuesService.sprint ? this.issuesService.sprint.name : ''
  }

  ngOnInit(): void {
    this.prepareIssueDatasources()
  }

  prepareIssueDatasources(): void {
    this.printingConfigurationService.getToPrintIssues()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(issues => {
        const sortedIssues = this.sortIssuesByType(issues)
        const smallPostitIssues = sortedIssues.filter(issue =>
          !this.printingConfigurationService.getCurrentFullPostitIssueTypes().includes(issue.type)
        )
        if (this.printingConfigurationService.getCurrentGroupByComponents()) {
          this.smallPostitIssues = this.groupIssuesByComponents(smallPostitIssues)
        } else {
          this.smallPostitIssues = [smallPostitIssues]
        }
        this.fullPostitIssues = sortedIssues.filter(issue =>
          this.printingConfigurationService.getCurrentFullPostitIssueTypes().includes(issue.type)
        )
      })
  }

  sortIssuesByType(issues: Issue[]): Issue[] {
    const types = this.availableTypes(issues)
    const sortedIssues = issues.sort((leftIssue, rightIssue) => {
      if (types.indexOf(leftIssue.type) === types.indexOf(rightIssue.type)) {
        return 0
      } else if (types.indexOf(leftIssue.type) < types.indexOf(rightIssue.type)) {
        return -1
      } else {
        return 1
      }
    })

    return sortedIssues
  }

  // separates the issues in lists based on their first component
  groupIssuesByComponents(issues: Issue[]): Issue[][] {
    const groupedIssuesByComponent = this.availableComponents(issues).map(component => {
      return issues.filter(issue => {
        return issue.components && issue.components.length > 0 && issue.components[0] === component
      })
    })
    const issuesWithoutComponent = issues.filter(issue => issue.components.length === 0)
    groupedIssuesByComponent.push(issuesWithoutComponent)

    return groupedIssuesByComponent
  }

  // gather from the list of issues, all the possible components
  availableComponents(issues: Issue[]): string[] {
    const components: string[] = []
    issues.forEach(element => {
      components.push(...element.components)
    })

    return components
      .filter((value, index, array) => index === array.indexOf(value))
      .sort((left, right) => {
        return (left.toLowerCase() < right.toLowerCase()) ? -1 : (left.toLowerCase() > right.toLowerCase()) ? 1 : 0
      })
  }

  // gather from the list of issues, all the possible types of issues
  availableTypes(issues: Issue[]): string[] {
    const types: string[] = []
    issues.forEach(element => {
      types.push(element.type)
    })

    return types
      .filter((value, index, array) => index === array.indexOf(value))
      .sort((left, right) => {
        const isRightTypeFullPostit = this.printingConfigurationService.getCurrentFullPostitIssueTypes().includes(right)
        const isLeftTypeFullPostit = this.printingConfigurationService.getCurrentFullPostitIssueTypes().includes(left)
        if (left.toLowerCase() > right.toLowerCase() || isRightTypeFullPostit) {
          return 1
        } else if (left.toLowerCase() < right.toLowerCase() || isLeftTypeFullPostit) {
          return -1
        } else {
          return 0
        }
      })
  }

  ngOnDestroy(): void {
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }
}

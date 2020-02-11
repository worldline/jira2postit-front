import { Component, OnInit, OnDestroy } from '@angular/core'
import { KanbanIssuesService } from '../../services/kanban-issues/kanban-issues.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Issue } from '../../services/scrum-issues/issue'
import { KanbanColumn } from '../../services/kanban-issues/kanban-column'
import { LoginService } from '../../services/login/login.service'
import { FormGroup, FormBuilder, FormArray, FormControl, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms'
import { PrintingConfigurationService } from '../../services/printing-configuration/printing-configuration.service'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { Step } from '../progress-bar/step'

@Component({
  selector: 'app-kanban-issues',
  templateUrl: './kanban-issues.component.html',
  styleUrls: ['./kanban-issues.component.css']
})
export class KanbanIssuesComponent implements OnInit, OnDestroy {
  form: FormGroup
  boardName: string
  columns: KanbanColumn[]
  step = Step.ISSUES
  private unsubscribe = new Subject<void>()

  constructor(
    private kanbanIssuesService: KanbanIssuesService,
    private printingConfigurationService: PrintingConfigurationService,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.formBuilder.group({sections: this.formBuilder.array([])}, {validator: this.minimumCheckboxSelectedValidator})
  }

  ngOnInit() {
    const boardId = this.route.snapshot.paramMap.get('boardId')
    this.boardName =  this.loginService.board ? this.loginService.board.name : ''
    this.getIssues(boardId)
  }

  get sections() {
    return this.form.get('sections') as FormArray
  }

  section(index: number) {
    return this.sections.controls[index] as FormGroup
  }

  issue(sectionIndex: number, index: number) {
    return (this.section(sectionIndex).get('issues') as FormArray).controls[index] as FormControl
  }

  getIssues(boardId: string) {
    this.kanbanIssuesService.getKanbanIssues(boardId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(kanbanColumns => {
        this.populateForm(kanbanColumns)
        this.columns = kanbanColumns
      })
  }

  populateForm(kanbanColumns: KanbanColumn[]) {
    kanbanColumns.forEach((column: KanbanColumn) => {
      const selectedColumn = ![...Array.from(new Set(column.issues.map(issue => issue.type)))]
        .some(type => !this.printingConfigurationService.getCurrentPrintableIssueTypes().includes(type))
      this.sections.push(this.formBuilder.group({
        name: selectedColumn,
        issues: this.populateSection(column.issues)
      }))
    })
    this.listenToIssueSelection()
    this.listenToColumnSelection()
  }

  populateSection(issues: Issue[]): FormArray {
    const issueArray = new FormArray([])
    issues.forEach((issue: Issue) => {
      const selected = this.printingConfigurationService.getCurrentPrintableIssueTypes().includes(issue.type)
      issueArray.push(this.formBuilder.control(selected))
    })
    return issueArray
  }

  minimumCheckboxSelectedValidator(abstractControl: AbstractControl) {
      const errors: ValidationErrors = {}
      const selectedCount = (abstractControl.get('sections') as FormArray).controls.flatMap(group => group.get('issues').value)
        .reduce((count, selected) => count ? count + selected : selected, 0)
      if (selectedCount === 0 || selectedCount === false) {
        errors.noIssue = {message: 'You must select at least one issue'}
      }
      return Object.keys(errors).length ? errors : null
  }

  listenToIssueSelection() {
    this.sections.controls.forEach((column, index) => {
      column.get('issues').valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((selection: [boolean]) => {
        const allIssueSelected = selection.every(item => item)
        this.section(index).get('name').patchValue(allIssueSelected, {emitEvent: false})
      })
    })
  }

  listenToColumnSelection() {
    this.sections.controls.forEach((column, index) => {
      column.get('name').valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((selected: boolean) => {
        const issueArray = this.section(index).get('issues') as FormArray
        issueArray.patchValue(new Array(issueArray.controls.length).fill(selected), {emitEvent: false})
      })
    })
  }

  onSubmit() {
    const allIssues = this.columns.flatMap(column => column.issues)
    const selectedCheckboxes = this.sections.controls.flatMap(group => group.get('issues').value)
    const selectedIssues = allIssues.filter((issue, index) => selectedCheckboxes[index])
    this.printingConfigurationService.updateToPrintIssues(selectedIssues)
    this.router.navigate([`/boards/${this.route.snapshot.paramMap.get('boardId')}/formattedTickets`])
  }

  ngOnDestroy() {
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms'
import { IssueTypesService } from '@services/issue-type/issue-types.service'
import { PrintingConfigurationService } from '@services/printing-configuration/printing-configuration.service'
import { BoardType, Board } from '@services/login/board'
import { Subscription, Subject } from 'rxjs'
import { IssueTypeConfiguration, PrintingSize, Configuration } from '@services/printing-configuration/configuration'
import { takeUntil, filter } from 'rxjs/operators'
import { Step } from '../progress-bar/step'
import { BoardService } from '@services/board/board.service'

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit, OnDestroy {
  boardId: string
  configuration: Configuration | null = null
  form: FormGroup
  projectKey: string | null = null
  submittedProjectKey = false
  error = ''
  private printableSubscriptions: Subscription[] = []
  private unsubscribe = new Subject<void>()
  preExistingData = false
  step = Step.CONFIGURATION

  constructor(
    private issueTypesService: IssueTypesService,
    private printingConfigurationService: PrintingConfigurationService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private boardService: BoardService
  ) {
    this.form = this.formBuilder.group({
      printables: this.formBuilder.array([]),
      sizes: this.formBuilder.array([]),
      groupByComponents: this.formBuilder.control(false)
    })
    this.boardId = this.route.snapshot.paramMap.get('boardId') as string
  }

  ngOnInit(): void {
    if (this.boardId) {
      this.retrieveConfiguration(this.boardId)
    }
  }

  // convenience getter for easy access to form fields
  get printables(): FormArray { return this.form.get('printables') as FormArray }
  get sizes(): FormArray { return this.form.get('sizes') as FormArray }
  get groupByComponents(): FormControl { return this.form.get('groupByComponents') as FormControl }

  retrieveConfiguration(boardId: string): void {
    this.printingConfigurationService.readPersistedConfiguration(boardId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(configuration => {
        if (configuration) {
          this.projectKey = configuration.projectKey
          this.submittedProjectKey = true
          this.configuration = configuration
          this.populateForm(configuration)
          this.preExistingData = true
        }
      })
  }

  getIssueTypes(): void {
    if (this.projectKey && this.boardId) {
      this.issueTypesService.getIssueTypes(this.boardId, this.projectKey)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(issueTypes => {
          const previousConfiguration = this.configuration
          this.resetIssueTypes()
          const groupByComponents = previousConfiguration ? previousConfiguration.groupByComponents : false
          const issueTypeConfigurations = issueTypes.map(type => {
            let previousTypeConfig: IssueTypeConfiguration | undefined
            if (previousConfiguration) {
              previousTypeConfig = previousConfiguration.issueTypes.find(typeConfig => typeConfig.type.name === type.name)
            }

            return new IssueTypeConfiguration(
              type,
              previousTypeConfig ? previousTypeConfig.pritingSize : PrintingSize.Full,
              previousTypeConfig ? previousTypeConfig.toPrint : true
            )
          })
          if (this.projectKey) {
            const newConfiguration = new Configuration(this.projectKey, issueTypeConfigurations, groupByComponents)
            this.populateForm(newConfiguration)
            this.configuration = newConfiguration
            this.submittedProjectKey = true
          }
        }, (error: string) => {
          this.error = error
        })
    }
  }

  resetIssueTypes(): void {
    this.submittedProjectKey = false
    this.configuration = null
    this.printableSubscriptions.forEach(s => s.unsubscribe())
    this.printables.clear()
    this.sizes.clear()
  }

  populateForm(configuration: Configuration): void {
    this.groupByComponents.patchValue(configuration.groupByComponents)
    configuration.issueTypes.forEach(typeConfig => {
      this.printables.push(this.formBuilder.group({
        name: typeConfig.type.name,
        printable: typeConfig.toPrint
      }))
      this.sizes.push(this.formBuilder.group({
        name: typeConfig.type.name,
        isFullPostit: { value: typeConfig.pritingSize === PrintingSize.Full, disabled: !typeConfig.toPrint}
      }))
    })
    this.listenToPrintableChanges()
  }

  listenToPrintableChanges(): void {
    this.printables.controls.forEach((type, index) => {
      const printable = type.get('printable')
      if (printable) {
        const subscription = printable.valueChanges
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(print => {
            const isFullPostitControl = this.sizes.controls[index].get('isFullPostit')
            if (isFullPostitControl) {
              if (print) {
                isFullPostitControl.enable()
              } else {
                isFullPostitControl.disable()
              }
            }
          })
        if (subscription) {
          this.printableSubscriptions.push(subscription)
        }
      }
    })
  }

  extractConfigurationFromForm(): Configuration | null {
    if (!this.configuration) {
      return null
    } else {
      const newIssueTypes = this.configuration.issueTypes.map((typeConfig: IssueTypeConfiguration, index: number) => {
        const pritingSize = (this.sizes.controls[index].get('isFullPostit') as FormControl).value ? PrintingSize.Full : PrintingSize.Third
        const toPrint = (this.printables.controls[index].get('printable') as FormControl).value as boolean

        return new IssueTypeConfiguration(typeConfig.type, pritingSize, toPrint)
      })

      const groupByComponents = this.groupByComponents.value as boolean

      return new Configuration(this.configuration.projectKey, newIssueTypes, groupByComponents)
    }
  }

  onSubmit(): void {
    this.configuration = this.extractConfigurationFromForm()
    if (this.configuration) {
      this.persist(this.configuration)
    }
  }

  persist(configuration: Configuration): void {
    this.printingConfigurationService.persistConfiguration(this.boardId, configuration)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((dbConfiguration: Configuration) => {
        this.updatePrintingConfiguration(dbConfiguration)
        this.navigateToIssueSelection()
      })
  }

  updatePrintingConfiguration(configuration: Configuration): void {
    const fullPostitIssueTypes = configuration.issueTypes
      .filter(typeConfig => typeConfig.pritingSize === PrintingSize.Full)
      .map(typeConfig => typeConfig.type)
    this.printingConfigurationService.updateFullPostitIssueTypes(fullPostitIssueTypes)

    const printableIssueTypes = configuration.issueTypes
      .filter(typeConfig => typeConfig.toPrint)
      .map(typeConfig => typeConfig.type)
    this.printingConfigurationService.updatePrintableIssueTypes(printableIssueTypes)
    this.printingConfigurationService.updateGroupByComponents(this.groupByComponents.value as boolean)
    this.preExistingData = true
  }

  navigateToIssueSelection(): void {
    this.boardService.getBoard(this.boardId) // TODO extract redirection logic to child router-outlet with root component
    this.boardService.board.pipe(
      filter(val => val != null),
      takeUntil(this.unsubscribe)
    ).subscribe(board => {
      switch (board?.type) {
        case BoardType.Scrum: {
          this.router.navigate([`/boards/${this.boardId}/sprints`])
          break
        }
        case BoardType.Kanban: {
          this.router.navigate([`/boards/${this.boardId}/issues`])
          break
        }
        default:
          console.log('Board type is not recognized')
          this.router.navigate([`/login`])
          break
      }
    })
  }

  onSkip(): void {
    this.configuration = this.extractConfigurationFromForm()
    if (this.configuration) {
      this.updatePrintingConfiguration(this.configuration)
      this.navigateToIssueSelection()
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }
}

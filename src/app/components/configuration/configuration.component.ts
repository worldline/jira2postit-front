import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { IssueTypesService } from '../../services/issue-type/issue-types.service';
import { LoginService } from '../../services/login/login.service';
import { PrintingConfigurationService } from '../../services/printing-configuration/printing-configuration.service';
import { IssueType } from '../../services/issue-type/issue-type';
import { BoardType } from '../../services/login/board';
import { Subscription, Subject } from 'rxjs';
import { IssueTypeConfiguration, PrintingSize, Configuration } from '../../services/printing-configuration/configuration';
import { takeUntil } from 'rxjs/operators';
import { Step } from '../progress-bar/step';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit, OnDestroy {
  boardId: string;
  configuration: Configuration;
  form: FormGroup;
  projectKey: string = null;
  submittedProjectKey = false;
  error = '';
  private printableSubscriptions: Subscription[] = [];
  private unsubscribe = new Subject<void>();
  preExistingData = false;
  step = Step.CONFIGURATION;

  constructor(
    private issueTypesService: IssueTypesService,
    private loginService: LoginService,
    private printingConfigurationService: PrintingConfigurationService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      printables: this.formBuilder.array([]),
      sizes: this.formBuilder.array([]),
      groupByComponents: this.formBuilder.control(false)
    });
  }

  ngOnInit() {
    this.boardId = this.route.snapshot.paramMap.get('boardId');
    this.retrieveConfiguration(this.boardId);
  }

  // convenience getter for easy access to form fields
  get printables() { return this.form.get('printables') as FormArray; }
  get sizes() { return this.form.get('sizes') as FormArray; }
  get groupByComponents() { return this.form.get('groupByComponents') as FormControl; }

  retrieveConfiguration(boardId: string) {
    this.printingConfigurationService.readPersistedConfiguration(boardId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(configuration => {
        if (configuration) {
          this.populateForm(configuration);
          this.preExistingData = true;
        }
      });
  }

  getIssueTypes() {
    if (this.projectKey) {
      this.issueTypesService.getIssueTypes(this.boardId, this.projectKey)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(issueTypes => {
          const previousConfiguration = this.configuration;
          this.resetIssueTypes();
          const groupByComponents = previousConfiguration ? previousConfiguration.groupByComponents : false;
          const issueTypeConfigurations = issueTypes.map(type => {
            let previousTypeConfig: IssueTypeConfiguration = null;
            if (previousConfiguration) {
              previousTypeConfig = previousConfiguration.issueTypes.find(typeConfig => typeConfig.type.name === type.name);
            }
            return new IssueTypeConfiguration(
              type,
              previousTypeConfig ? previousTypeConfig.pritingSize : PrintingSize.Full,
              previousTypeConfig ? previousTypeConfig.toPrint : true
            );
          });
          this.configuration = new Configuration(this.projectKey, issueTypeConfigurations, groupByComponents);
          this.populateForm(this.configuration);
          this.submittedProjectKey = true;
        }, error => {
          this.error = error;
        });
    }
  }

  resetIssueTypes() {
    this.submittedProjectKey = false;
    this.configuration = null;
    this.printableSubscriptions.forEach(s => s.unsubscribe());
    while (this.printables.length > 0) { // TODO: use this.shouldPrint.clear(); after migration to angular 8
      this.printables.removeAt(0);
    }
    while (this.sizes.length > 0) { // TODO: use this.sizes.clear(); after migration to angular 8
      this.sizes.removeAt(0);
    }
  }

  populateForm(configuration: Configuration) {
    this.projectKey = configuration.projectKey;
    this.submittedProjectKey = true;
    this.configuration = configuration;
    this.groupByComponents.patchValue(configuration.groupByComponents);
    configuration.issueTypes.forEach(typeConfig => {
      this.printables.push(this.formBuilder.group({
        name: typeConfig.type.name,
        printable: typeConfig.toPrint
      }));
      this.sizes.push(this.formBuilder.group({
        name: typeConfig.type.name,
        isFullPostit: {value: typeConfig.pritingSize === PrintingSize.Full, disabled: !typeConfig.toPrint}
      }));
    });
    this.onToPrintableChanges();
  }

  onToPrintableChanges() {
    this.printables.controls.forEach((type, index) => {
      const subscription = type.get('printable').valueChanges
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(print => {
          if (print) {
            this.sizes.controls[index].get('isFullPostit').enable();
          } else {
            this.sizes.controls[index].get('isFullPostit').disable();
          }
        });
      this.printableSubscriptions.push(subscription);
    });
  }

  extractConfigurationFromForm(): Configuration {
    const issueTypeConfigurations = this.configuration.issueTypes.map((typeConfig, index) => {
      const size = (this.sizes.controls[index].get('isFullPostit') as FormControl).value ? PrintingSize.Full : PrintingSize.Third;
      const shouldPrint = this.printables.controls[index].get('printable').value;
      return new IssueTypeConfiguration(typeConfig.type, size, shouldPrint);
    });
    this.configuration.issueTypes = issueTypeConfigurations;
    this.configuration.groupByComponents = this.groupByComponents.value;
    return this.configuration;
  }

  onSubmit() {
    const configuration = this.extractConfigurationFromForm();
    this.persist(configuration);
  }

  updatePrintingConfiguration(configuration: Configuration) {
    const fullPostitIssueTypes = configuration.issueTypes
      .filter(typeConfig => typeConfig.pritingSize === PrintingSize.Full)
      .map(typeConfig => typeConfig.type);
    this.printingConfigurationService.updateFullPostitIssueTypes(fullPostitIssueTypes);

    const printableIssueTypes = configuration.issueTypes
      .filter(typeConfig => typeConfig.toPrint)
      .map(typeConfig => typeConfig.type);
    this.printingConfigurationService.updatePrintableIssueTypes(printableIssueTypes);
    this.printingConfigurationService.updateGroupByComponents(this.groupByComponents.value);
    this.preExistingData = true;
  }

  navigateToIssueSelection() {
    if (this.loginService.board) {
      switch (this.loginService.board.type) {
        case BoardType.Scrum: {
          this.router.navigate([`/boards/${this.boardId}/sprints`]);
          break;
        }
        case BoardType.Kanban: {
          this.router.navigate([`/boards/${this.boardId}/issues`]);
          break;
        }
        default:
          console.log('Board type is not recognized');
          break;
      }
    } else {
      this.router.navigate([`/login`]);
    }
  }

  onSkip() {
    const configuration = this.extractConfigurationFromForm();
    this.updatePrintingConfiguration(configuration);
    this.navigateToIssueSelection();
  }

  persist(configuration: Configuration) {
    this.printingConfigurationService.persistConfiguration(this.boardId, configuration)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(dbConfiguration => {
        this.updatePrintingConfiguration(dbConfiguration);
        this.navigateToIssueSelection();
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}

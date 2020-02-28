import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { Issue } from '../scrum-issues/issue'
import { IssueType } from '../issue-type/issue-type'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { Configuration } from './configuration'

const headers = new HttpHeaders({'Content-Type':  'application/json'})

const httpOptions = {
  headers: headers,
  withCredentials: true
}

@Injectable({
  providedIn: 'root'
})
export class PrintingConfigurationService {
  private toPrintIssues = new BehaviorSubject<Issue[]>([])
  private fullPostitIssueTypes = new BehaviorSubject<IssueType[]>([])
  private printableIssueTypes = new BehaviorSubject<IssueType[]>([])
  private groupByComponents = new BehaviorSubject<boolean>(false)

  constructor(private http: HttpClient) { }

  getToPrintIssues(): Observable<Issue[]> {
    return this.toPrintIssues.asObservable()
  }

  updateToPrintIssues(issues: Issue[]) {
    this.toPrintIssues.next(issues)
  }

  getFullPostitIssueTypes(): Observable<IssueType[]> {
    return this.fullPostitIssueTypes.asObservable()
  }

  updateFullPostitIssueTypes(issueTypes: IssueType[]) {
    this.fullPostitIssueTypes.next(issueTypes)
  }

  getCurrentFullPostitIssueTypes(): string[] {
    return this.fullPostitIssueTypes.getValue().map(type => type.name)
  }

  getPrintableIssueTypes(): Observable<IssueType[]> {
    return this.printableIssueTypes.asObservable()
  }

  updatePrintableIssueTypes(issueTypes: IssueType[]) {
    this.printableIssueTypes.next(issueTypes)
  }

  getCurrentPrintableIssueTypes(): string[] {
    return this.printableIssueTypes.getValue().map(type => type.name)
  }

  getGroupByComponents(): Observable<boolean> {
    return this.groupByComponents.asObservable()
  }

  updateGroupByComponents(groupByComponents: boolean) {
    this.groupByComponents.next(groupByComponents)
  }

  getCurrentGroupByComponents(): boolean {
    return this.groupByComponents.getValue()
  }

  readPersistedConfiguration(boardId: string): Observable<Configuration> {
    const configurationUrl = `board/${boardId}/settings`
    return this.http.get<Configuration>(environment.baseUrl + configurationUrl, httpOptions)
  }

  persistConfiguration(boardId: string, configuration: Configuration): Observable<any> {
    const configurationUrl = `board/${boardId}/settings`
    return this.http.post(environment.baseUrl + configurationUrl, configuration, httpOptions)
  }
}

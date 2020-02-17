import { Injectable } from '@angular/core'
import { IssueType } from './issue-type'
import { HttpHeaders, HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

const headers = new HttpHeaders({'Content-Type':  'application/json'})

const httpOptions = {
  headers: headers,
  withCredentials: true
}

@Injectable({
  providedIn: 'root'
})
export class IssueTypesService {
  constructor(private http: HttpClient) { }

  getIssueTypes(boardId: string, projectKey: string): Observable<[IssueType]> {
    const issueTypesUrl = `board/${boardId}/project/${projectKey}/issueTypes`
    return this.http.get<[IssueType]>(environment.baseUrl + issueTypesUrl, httpOptions)
  }
}

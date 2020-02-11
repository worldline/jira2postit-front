import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { KanbanColumn } from './kanban-column'

const headers = new HttpHeaders({'Content-Type':  'application/json'})

const httpOptions = {
  headers,
  withCredentials: true
}

@Injectable({
  providedIn: 'root'
})
export class KanbanIssuesService {
  constructor(private http: HttpClient) { }

  getKanbanIssues(boardId: string): Observable<[KanbanColumn]> {
    const issueUrl = `board/${boardId}/issue`
    return this.http.get<[KanbanColumn]>(environment.baseUrl + issueUrl, httpOptions)
  }
}

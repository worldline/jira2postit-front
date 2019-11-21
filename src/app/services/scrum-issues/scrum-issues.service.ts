import { Injectable } from '@angular/core';
import { Issue } from './issue';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Sprint } from '../sprints/sprint';

const headers = new HttpHeaders({'Content-Type':  'application/json'});

const httpOptions = {
  headers: headers,
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class ScrumIssuesService {
  sprint: Sprint = null;
  sprintId: string = null;

  constructor(private http: HttpClient) { }

  getIssues(boardId: string, sprintId: string): Observable<Issue[]> {
    const issueUrl = `board/${boardId}/sprint/${sprintId}/issue`;
    return this.http.get<Issue[]>(environment.baseUrl + issueUrl, httpOptions);
  }
}

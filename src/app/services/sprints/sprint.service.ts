import { Injectable } from '@angular/core';
import { SprintResponse } from './sprint';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

var headers = new HttpHeaders({'Content-Type':  'application/json'});

const httpOptions = {
  headers: headers,
  withCredentials: true
}

@Injectable({
  providedIn: 'root'
})
export class SprintService {
  constructor(private http: HttpClient) { }

  getSprints(boardId: string): Observable<SprintResponse> {
    const sprintsUrl = `board/${boardId}/sprint`;
    return this.http.get<SprintResponse>(environment.baseUrl + sprintsUrl, httpOptions);
  }
}

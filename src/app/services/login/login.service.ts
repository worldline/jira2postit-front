import { Injectable } from '@angular/core';
import { Login } from './login';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Board } from './board';

const headers = new HttpHeaders({'Content-Type':  'application/json'});

const httpOptions = {
  headers: headers,
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginUrl = 'login/';
  public board: Board = null;

  constructor(private http: HttpClient) { }

  login(username: string, password: string, id: string): Observable<Board> {
    const login: Login = {
      boardId: id,
      username: username,
      password: password
    };

    return this.http.post<Board>(environment.baseUrl + this.loginUrl, login, httpOptions);
  }

  logout(): Observable<void> {
    sessionStorage.removeItem('isAuthenticated');
    this.board = null;
    return this.http.get<void>(environment.baseUrl + 'logout', httpOptions);
  }

  getAuthenticated(): boolean {
    return Boolean(JSON.parse(sessionStorage.getItem('isAuthenticated')));
  }

  setAuthenticated(isAuthenticated: boolean) {
    sessionStorage.setItem('isAuthenticated', `${isAuthenticated}`);
  }
}

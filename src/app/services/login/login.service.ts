import { Injectable } from '@angular/core'
import { Login } from './login'
import { Observable } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { Board } from './board'
import { BoardService } from '../board/board.service'
import { tap } from 'rxjs/operators'

const headers = new HttpHeaders({'Content-Type':  'application/json'})

const httpOptions = {
  headers: headers,
  withCredentials: true
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginUrl = 'login/'
  public board: Board | null = null

  constructor(
    private http: HttpClient,
    private boardService: BoardService
  ) { }

  login(username: string, password: string, id: string): Observable<Board> {
    const login: Login = {
      boardId: id,
      username,
      password
    }
    this.boardService.boardId = id

    return this.http.post<Board>(environment.baseUrl + this.loginUrl, login, httpOptions)
      .pipe(tap(val => {
        this.setAuthenticated(true)
        this.board = val
        this.boardService.board.next(val)
      }))
  }

  logout(): Observable<void> {
    this.setAuthenticated(false)
    this.board = null

    return this.http.get<void>(environment.baseUrl + 'logout', httpOptions)
  }

  getAuthenticated(): boolean {
    const deadline = localStorage.getItem('sessionExpiration')
    if (deadline) {
      const now = new Date()

      return now < new Date(JSON.parse(deadline) as string)
    }

    return false
  }

  setAuthenticated(isAuthenticated: boolean): void {
    if (!isAuthenticated) {
      localStorage.removeItem('sessionExpiration')
      this.board = null
    } else {
      const now = new Date()
      const deadline = now.setMilliseconds(environment.maxAge)
      localStorage.setItem('sessionExpiration', `${JSON.stringify(deadline)}`)
    }
  }
}

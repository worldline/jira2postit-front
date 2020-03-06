import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Board } from '../login/board';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

const headers = new HttpHeaders({'Content-Type':  'application/json'})

const httpOptions = {
  headers: headers,
  withCredentials: true
}

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  boardId: string | undefined = undefined;
  board: BehaviorSubject<Board | null> = new BehaviorSubject<Board | null>(null);

  constructor(private http: HttpClient) {}

  getBoard(boardId: string) {
    if (boardId !== this.boardId && this.board.value === null) {
      this.boardId = boardId
      const boardUrl = `board/${boardId}`

      this.http.get<Board>(environment.baseUrl + boardUrl, httpOptions)
        .subscribe({
          next: board => this.board.next(board),
          error: () => this.board.next(null),
          complete: () => this.board.complete()
        })
    }
  }
}

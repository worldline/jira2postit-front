export class Board {
    id: number;
    name: string;
    type: BoardType;
  }

export enum BoardType {
  Scrum = 'scrum',
  Kanban = 'kanban',
}

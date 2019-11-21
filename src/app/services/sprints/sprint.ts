export class Sprint {
    id: number;
    name: string;
    state: string;
  }

export class SprintResponse {
  maxResults: number;
  startAt: number;
  isLast: boolean;
  values: Sprint[];
}

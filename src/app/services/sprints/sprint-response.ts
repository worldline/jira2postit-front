import { Sprint } from './sprint'

export interface SprintResponse {
    maxResults: number
    startAt: number
    isLast: boolean
    values: Sprint[]
  }

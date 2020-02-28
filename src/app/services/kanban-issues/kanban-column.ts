import { Issue } from '../scrum-issues/issue'

export interface KanbanColumn {
    name: string
    issues: Issue[]
}

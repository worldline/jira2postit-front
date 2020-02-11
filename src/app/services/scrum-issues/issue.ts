import { Epic } from './epic'

export interface Issue {
    key: string
    summary: string
    components: string[]
    epic: Epic
    type: string
    column: string
    complexity: string
}

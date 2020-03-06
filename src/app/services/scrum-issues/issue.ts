import { Epic } from './epic'

export interface Issue {
    key: string
    summary: string
    components: string[]
    epic: Epic | undefined
    type: string
    column: string
    complexity: string
}

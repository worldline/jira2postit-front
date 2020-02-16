export enum StepStatus {
    active = 'active',
    done = 'done',
    todo = 'todo'
}

export class Step {
    public static CONFIGURATION = new Step(0, 'Configuration', '/boards/:boardId/configuration')
    public static SPRINTS = new Step(1, 'Sprint selection', '/boards/:boardId/configuration')
    public static ISSUES = new Step(1, 'Issue selection', '/boards/:boardId/configuration')
    public static PRINTING = new Step(2, 'Printing', '/boards/:boardId/configuration')
    name: string
    link: string
    status: StepStatus = StepStatus.todo
    index: number

    constructor(index: number, name: string, link: string) {
        this.index = index
        this.name = name
        this.link = link
    }
}

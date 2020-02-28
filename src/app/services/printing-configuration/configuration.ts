import { IssueType } from '../issue-type/issue-type'

export class Configuration {
    issueTypes: IssueTypeConfiguration[]
    projectKey: string
    groupByComponents: boolean

    constructor(projectKey: string, issueTypes: IssueTypeConfiguration[], groupByComponents: boolean) {
        this.projectKey = projectKey
        this.issueTypes = issueTypes
        this.groupByComponents = groupByComponents
    }
}

export class IssueTypeConfiguration {
    type: IssueType
    pritingSize: PrintingSize
    toPrint: boolean

    constructor(type: IssueType, printingSize: PrintingSize, toPrint: boolean) {
        this.type = type
        this.pritingSize = printingSize
        this.toPrint = toPrint
    }
}

export enum PrintingSize {
    Full = 'full',
    Third = 'third'
}

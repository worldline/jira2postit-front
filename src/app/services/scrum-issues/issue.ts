export class Issue {
    key: string;
    summary: string;
    components: string[];
    epic: Epic;
    type: string;
    column: string;
    complexity: string;
}

export class Epic {
    key: string;
    name: string;
}

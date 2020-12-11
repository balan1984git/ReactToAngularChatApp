export interface Showcontent {
    author: Author,
    text?: string,
    timestamp?: any;
}

export interface Author {
    id: string,
    name?: string
}
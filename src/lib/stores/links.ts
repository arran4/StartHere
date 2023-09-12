import {writable} from "svelte/store";

export interface Link {
    Name: string
    Link: string
}

export interface Category {
    Name: string
    Links: Array<Link>
}
export interface Column {
    Categories: Array<Category>
}

export interface LinkStructure {
    Columns?: Array<Column>
}

export default writable<null | LinkStructure>(null)
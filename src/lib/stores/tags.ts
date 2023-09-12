import {writable} from "svelte/store";

export interface Tag {
    Name: string
    Ref: string
}

export default writable<null | Array<Tag>>(null)
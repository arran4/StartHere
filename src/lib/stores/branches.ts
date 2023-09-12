import {writable} from "svelte/store";

export interface Branch {
    Name: string
    Ref: string
}

export default writable<null | Array<Branch>>(null)
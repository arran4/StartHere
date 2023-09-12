import {writable} from "svelte/store";

export interface UserAuthDetails {
    Token: string
    Username: string
}

export default writable<UserAuthDetails | null>(null)
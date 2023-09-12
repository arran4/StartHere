import {derived} from "svelte/store";
import {page} from "$app/stores";

export default derived([page], ([$page]) : string|null => {
    return $page?.url?.searchParams?.get("code") || null
})
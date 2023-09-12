// place files you want to import through the `$lib` alias in this folder.

import {Octokit} from "octokit";
import User from "$lib/stores/user";
import type {UserAuthDetails} from "$lib/stores/user";
import links, {GetLinks} from "$lib/stores/links";

export async function LoginUsingToken(githubToken : string, storeLoc : "local" | "session" = "session") : Promise<void> {
    const octokit = new Octokit({ auth: githubToken });
    const {
        data: { login },
    } = await octokit.rest.users.getAuthenticated();
    const user : UserAuthDetails = {
        Token: githubToken,
        Username: login,
    }
    console.log("Hello, %s", login);
    
    switch (storeLoc) {
        case "session":
            sessionStorage.setItem("user", JSON.stringify(user));
            break;
        case "local":
            localStorage.setItem("user", JSON.stringify(user));
            break;
    }
    User.set(user)

    links.set(await GetLinks(user))
}

// place files you want to import through the `$lib` alias in this folder.

import {Octokit} from "octokit";
import User from "$lib/stores/user";
import type {UserAuthDetails} from "$lib/stores/user";
import links from "$lib/stores/links";
import {GetDataFromGithub} from "$lib/getDataFromGithub";

export async function LoginUsingToken(githubToken : string, storeLoc : "local" | "session" = "session") : Promise<void> {
    const octokit = new Octokit({ auth: githubToken });
    const {
        data: { login },
    } = await octokit.rest.users.getAuthenticated();
    const user : UserAuthDetails = {
        Token: githubToken,
        Username: login,
    }
    switch (storeLoc) {
        case "session":
            sessionStorage.setItem("user", JSON.stringify(user));
            break;
        case "local":
            localStorage.setItem("user", JSON.stringify(user));
            break;
    }
    User.set(user)

    links.set(await GetDataFromGithub(user))
}

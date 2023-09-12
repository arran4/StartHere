import {writable} from "svelte/store";
import {type UserAuthDetails} from "$lib/stores/user";
import {Octokit} from "octokit";
import exampledefault from "./exampledefault.json" assert { type: "trext" };

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

export async function GetLinks(user : UserAuthDetails): Promise<LinkStructure> {
    const octokit = new Octokit({auth: user.Token});
    try {
        const result = await octokit.rest.repos.get({
            owner: user.Username,
            repo: "MyStart",
        });
        console.log(result)
    } catch (e) {
        try {
            console.log("Repo not found creating")
            const result = await octokit.rest.repos.createForAuthenticatedUser({
                name: "MyStart",
                auto_init: true,
                private: true,
            });
            console.log(result)
        } catch (e) {
            console.log("Failed to create", e)
            return {}
        }
    }
    let contents = exampledefault
    try {
        const result = await octokit.rest.repos.getContent({
            owner: user.Username,
            repo: "MyStart",
            path: "links.json"
        });
        contents = atob(result.data?.content)
    } catch (e) {
        try {
            console.log("Links not found creating")
            const result = await octokit.rest.repos.createOrUpdateFileContents({
                owner: user.Username,
                repo: "MyStart",
                path: "links.json",
                message: 'Create links.json',
                content: btoa(contents),
                // branch,
            });
            console.log(result)
        } catch (e) {
            console.log("Failed to create", e)
            return {}
        }
    }
    return JSON.parse(contents)
}

export default writable<null | LinkStructure>(null)
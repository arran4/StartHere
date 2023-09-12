import type {UserAuthDetails} from "$lib/stores/user";
import {Octokit} from "octokit";
import exampledefault from "$lib/stores/exampledefault.json";
import type {LinkStructure} from "$lib/stores/links";
import tags from "$lib/stores/tags";
import branches from "$lib/stores/branches";

export async function GetDataFromGithub(user: UserAuthDetails, ref: string | undefined = undefined): Promise<LinkStructure> {
    const octokit = new Octokit({auth: user.Token});
    try {
        const result = await octokit.rest.repos.get({
            owner: user.Username,
            repo: "MyStart",
        });
    } catch (e) {
        try {
            console.log("Repo not found creating")
            const result = await octokit.rest.repos.createForAuthenticatedUser({
                name: "MyStart",
                auto_init: true,
                private: true,
            });
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
            path: "links.json",
            ref
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
        } catch (e) {
            console.log("Failed to create", e)
            return {}
        }
    }
    tags.set(null)
    try {
        const result = await octokit.rest.repos.listTags({
            owner: user.Username,
            repo: "MyStart",
        });
        tags.set((result.data??[]).map((e) => ({
            Name: e.name,
            Ref: `refs/tags/${e.name}`,
        })));
    } catch (e) {
    }
    branches.set(null)
    try {
        const result = await octokit.rest.repos.listBranches({
            owner: user.Username,
            repo: "MyStart",
        });
        branches.set((result.data??[]).map((e) => ({
            Name: e.name,
            Ref: `refs/heads/${e.name}`,
        })));
    } catch (e) {
    }
    return JSON.parse(contents)
}
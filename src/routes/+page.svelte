<script lang="ts">
    import user from "$lib/stores/user";
    import {LoginUsingToken} from "$lib/tokenbased";
    import loginError from "$lib/stores/loginError";
    import {onMount} from "svelte";
    import links, {GetLinks} from "$lib/stores/links";

    let githubToken : string = ""
    let loading : boolean = true
    function Refresh() {
        $links = null
        if ($user) {
            GetLinks($user).then(links.set)
        }
    }

    onMount(() => {
        loading = true
        let u = sessionStorage.getItem("user")
        if (u) {
            $user = JSON.parse(u)
        }
        u = localStorage.getItem("user")
        if (u) {
            $user = JSON.parse(u)
        }
        Refresh()
        loading = false
    })

    function Logout() {
        sessionStorage.removeItem("user")
        localStorage.removeItem("user")
        $user = null
    }

</script>

<h1>Welcome to StartHere</h1>
{#if loading}
    Loading
{:else if !$user}
    <p>
        Please enter a github authorization token here:
    </p>
    <input type="text" bind:value={githubToken} /><br/>
    <button on:click|preventDefault={() => LoginUsingToken(githubToken, "local")}>Login Local Storage</button><br/>
    <button on:click|preventDefault={() => LoginUsingToken(githubToken, "session")}>Login Session Storage</button><br/>
    {$loginError??""}<br/>
    <p>
        Please note, this will be stored in local store in your browser, please ensure that it only has "contents" "read write access" to
        a repo called: "MyStart" under your username. It can be empty. (Use fine-grained tokens) If the repo `MyStart` doesn't exist, either
        create it with a "readme.md" file, or grant "Administrator" privileges with Read/Write and restrict it later.
    </p>
{:else}
    <p>
        Hi {$user?.Username ?? "No name"}
    </p>
    {#if $links}
        {#each ($links?.Columns??[]) as column}
            {#each (column?.Categories??[]) as category}
                <h1>{category.Name}</h1>
                <ui>
                    {#each (category.Links??[]) as link}
                        <li><a href={link.Link}>{link.Name}</a></li>
                    {/each}
                </ui>
            {/each}
        {/each}
    {:else}
        <p>
            Loading links
        </p>
    {/if}
    <hr/>
    <button on:click|preventDefault={() => Refresh()}>Refresh</button><br/>
    <button on:click|preventDefault={() => Logout()}>Logout</button><br/>
{/if}

<svelte:head>
    <title>Start Here</title>
</svelte:head>

<script lang="ts">
    import user from "$lib/stores/user";
    import {LoginUsingToken} from "$lib/tokenbased";
    import loginError from "$lib/stores/loginError";
    import {onMount} from "svelte";

    let githubToken : string = ""
    
    onMount(() => {
        let u = sessionStorage.getItem("user")
        if (u) {
            $user = JSON.parse(u)
        }
        u = localStorage.getItem("user")
        if (u) {
            $user = JSON.parse(u)
        }
    })

    function Logout() {
        sessionStorage.removeItem("user")
        localStorage.removeItem("user")
        $user = null
    }

</script>

<h1>Welcome to StartHere</h1>
{#if !$user}
    <p>
        Please enter a github authorization token here:
    </p>
    <input type="text" bind:value={githubToken} /><br/>
    <button on:click|preventDefault={() => LoginUsingToken(githubToken, "local")}>Login Local Storage</button><br/>
    <button on:click|preventDefault={() => LoginUsingToken(githubToken, "session")}>Login Session Storage</button><br/>
    {$loginError??""}<br/>
    <p>
        Please note, this will be stored in local store in your browser, please ensure that it only has "contents" "read write access" to
        a repo called: "MyStart" under your username. It can be empty. (Use fine-grained tokens)
    </p>
{:else}
    <p>
        Hi {$user?.Username ?? "No name"}
    </p>
    <button on:click|preventDefault={() => Logout()}>Logout</button><br/>
{/if}
<script lang="ts">
    import { enhance } from '$app/forms';

    export let form

    $: errors  = form?.errors

    function handleSignUp(){
        return async({ update }: any) => {
            await update()
        }
    }
</script>

<div class="flex justify-center items-center h-full">
    <div class="card p-4 variant-glass-secondary max-w-sm">
        <form id="form" class="space-y-4" method="post" action="?/sign_up" use:enhance={handleSignUp}>
            {#if errors}
                {#each errors as error}
                    <span class="text-error-500">{error}</span>
                {/each}
            {/if}
            <input class="input p-2" placeholder="Email" name="email">
            <input class="input p-2" type="password" placeholder="Password" name="password">
            <button form="form" type="submit" class="btn variant-filled-primary">Sign Up</button>
        </form>
        <a href="/auth/sign-in" class="underline block mt-6">Already have an account?</a>
    </div>
</div>

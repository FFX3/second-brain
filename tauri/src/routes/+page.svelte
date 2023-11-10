<script lang="ts">
    import { enhance } from '$app/forms';

	export let data

    async function handleEmbed(){
        return async({ update }: any) => {
            update()
        }
    }
    
    async function handleSignOut(){
        return async({ update }: any) => {
            update()
        }
    }
</script>

<div class="w-full flex flex-col items-center p-10 space-y-3">

    <div class="card p-4 variant-glass-secondary w-modal">
        <form method="post" class="space-y-4"  action="?/embed" use:enhance={handleEmbed}>
            <textarea required class="input p-2 w-full h-52" placeholder="Data" name="embed"></textarea>
            <div>
                <button class="btn variant-filled-primary" type="submit">Embed Text</button>
            </div>
        </form>
    </div>

    <form method="post" action="?/signout" use:enhance={handleSignOut}>
        <div>
            <button class="btn variant-filled-secondary" type="submit">Sign Out</button>
        </div>
    </form>
</div>



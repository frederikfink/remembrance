<script lang="ts">
	import { page } from "$app/stores";
	import { supabase } from "$lib/db";
    
    export let title:string;
    export let items:number;
    export let members:number;
    export let description:null|string;
    export let id:number;

    let newTitle: string = title;
    let newDescription: null|string = description;
    let inviteLink: string = `/${id}`;
    let showToast:boolean = false;

    const updateGroup = async () => {
        if(newTitle === '') throw new Error("title cannot be empty");

        
        const {error} = await supabase.from('groups').update({
            title: newTitle,
            description: newDescription
        }).eq('id', id) 

        if(error) throw new Error(error.message);

        title = newTitle;
        description = newDescription;
    }

    const copyInviteLink = () => {
        navigator.clipboard.writeText(inviteLink);
        toggleToast();
    }


    const toggleToast = async () => {
        showToast = true;
        await new Promise(resolve => setTimeout(resolve, 3000));
        showToast = false;
    }

</script>

<div class="grid grid-cols-6 items-center gap-2 px-2 text-left ">

    {#if showToast}
    <div class="toast toast-top toast-start">
        <div class="alert alert-success">
            <div>
            <span>Copied invite link to clipboard</span>
            </div>
        </div>
    </div>
    {/if}
    
    <div class="col-span-4">
        <p class="font-medium tracking-tight truncate">{title}</p>
        <p class="text-sm truncate"> {members} members | {items > 99 ? '99+' : items} items{description !== null ? ` | ${description}` : ''}</p>
    </div>

    <label for="modal-{id}" class="btn btn-accent">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>		
    </label>

    <a href="/{id}" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
        </svg>
    </a>

    <!-- Put this part before </body> tag -->
    <input type="checkbox" id="modal-{id}" class="modal-toggle" />
        <label for="modal-{id}" class="modal cursor-pointer modal-bottom sm:modal-middle">
        <label class="modal-box relative" for="">
            <h3 class="font-semibold text-xl truncate">Update {title}</h3>

            <form id="create-group-form-{id}" on:submit|preventDefault={updateGroup}>
                <div class="w-full">
                    <label class="label" for="group-title-input-{id}">
                          <span class="label-text">Group Title</span>
                    </label>
                    <input bind:value={newTitle} id="group-title-input-{id}" type="text" placeholder="Type here" class="input input-bordered w-full" />
                </div>
                <div class="w-full">
                    <label class="label" for="group-description-input-{id}">
                          <span class="label-text">Group Description</span>
                    </label>
                    <input bind:value={newDescription} id="group-description-input-{id}" type="text" placeholder="Type here" class="input input-bordered w-full" />
                </div>
            </form>

            <div class="w-full my-2">
                <p class="label-text">Invite more members, send invite link</p>
                <button on:click={copyInviteLink} class="btn w-full mt-2">
                    Invite!
                </button>
            </div>

            <div class="modal-action">
                <input form="create-group-form-{id}" type="submit" class="btn btn-success" value="Update!" />
            </div>

        </label>
    </label>	
</div>
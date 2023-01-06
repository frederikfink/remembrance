<script lang="ts">
	import { page } from '$app/stores';
	import { supabase } from '$lib/db';
	import type { Item } from '$lib/types/types';
	import { onDestroy, onMount } from 'svelte';

	let messages: any[] = [];
	let newItemName: null | string = null;
	let lastModifiedItem : null|Item = null;

	onMount(async () => {
		const { error, data } = await supabase.from('items').select('*').eq('completed', false);

		if (data == null) throw new Error('');

		messages = data;

		supabase
			.channel('public:items')
			.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'items' }, (payload) => {
				messages = [...messages, payload.new];
			})
			.on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'items' }, (payload) => {
				messages = messages.filter((m) => m.id !== payload.old.id);
			})
			.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'items' }, (payload) => {
				if(payload.new.completed == true) {
					messages = messages.filter((m) => m.id !== payload.new.id);
				}
			})
			.subscribe();
	});

	const addItem = async () => {
		if(newItemName == null || newItemName == '') throw new Error("new items must have a name");
		
		const {error} = await supabase.from('items').insert([{
			name: newItemName
		}])

		if(error) throw new Error(error.message);

		newItemName = '';
	};

	const removeItem = async (id: number) => {
		if(id == 0) throw new Error("id cannot be 0");

		const {error} = await supabase.from('items').delete().eq('id', id);

		if(error) throw new Error(error.message);
	};

	const completeItem = async (id: number) => {
		if(id == 0) throw new Error("id cannot be 0");
		
		const {error} = await supabase.from('items').update({completed: true}).eq('id', id);

		if(error) throw new Error(error.message);
	};

	onDestroy(() => {
		supabase.removeAllChannels();
	});
</script>

{#if !$page.data.session}
	<span />
{:else}
	<div class="flex w-100 gap-4 p-2 border-b">
		<button class="btn btn-outline btn-info gap-2">
			Groceries
			<div class="badge">2</div>
		</button>
		<button class="btn btn-outline gap-2">
			Wishlist
			<div class="badge">+99</div>
		</button>
	</div>

	<div id="items-container" class="p-2 grow mb-12 flex flex-col justify-end divide-y">
		{#each messages as message}
			<div class=" flex py-2 gap-4">
				<div>
					<h4 class="font-semibold m-0">{message.name}</h4>
					<small class="m-0">{message.created_at}</small>
				</div>
				<button
					on:click={() => removeItem(message.id)}
					class="ml-auto btn btn-outline btn-warning h-full"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-current flex-shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
				</button>
				<button
					on:click={() => completeItem(message.id)}
					class="btn btn-outline btn-success h-full"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-current flex-shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
				</button>
			</div>
		{/each}
	</div>
	<div class="fixed bottom-0 w-full">
		<form on:submit|preventDefault={addItem}>
			<div class="input-group">
				<input
					bind:value={newItemName}
					type="text"
					placeholder="Add item…"
					class="input input-bordered w-full"
				/>
				<button class="btn">Add</button>
			</div>
		</form>
	</div>
{/if}

<script lang="ts">
	import { page } from '$app/stores';
	import { supabase } from '$lib/db';
	import type { Item } from '$lib/types/types';
	import { onDestroy, onMount } from 'svelte';

	let items: any[] = [];
	let newItemName: null | string = null;
	let lastModifiedItem: null | Item = null;
	let loading: boolean = false;
	const dateNow = new Date();

	const formatDate = (date: string) => {
		const seconds = Math.floor((dateNow.getTime() - new Date(date).getTime()) / 1000);

		let interval = seconds / 31536000;

		if (seconds < 0) {
			return 'just now';
		}

		if (interval > 1) {
			return `${Math.floor(interval)} years ago`;
		}
		interval = seconds / 2592000;
		if (interval > 1) {
			return `${Math.floor(interval)} months ago`;
		}
		interval = seconds / 86400;
		if (interval > 1) {
			return `${Math.floor(interval)} days ago`;
		}
		interval = seconds / 3600;
		if (interval > 1) {
			return `${Math.floor(interval)} hours ago`;
		}
		interval = seconds / 60;
		if (interval > 1) {
			return `${Math.floor(interval)} minutes ago`;
		}
		return Math.floor(seconds) + ` seconds ago`;
	};

	const fetchGroup = async () => {
		const { data, error } = await supabase.from('groups').select('*').eq('id', $page.params.group);

		if (error) throw new Error(error.message);

		console.log(data[0]);
		return data[0];
	};

    const isMemberOfGroup = async () : Promise<boolean> => {
		const { error, data } = await supabase
			.from('group_members')
			.select('*')
			.eq('group_id', $page.params.group)
			.eq('member_id', $page.data.session?.user.id);

        if(error) throw new Error(error.message);

        return data.length === 0 ? false : true;
        
    }

	onMount(async () => {

        const isMember:boolean = await isMemberOfGroup();

        if(!isMember) throw new Error("user not member of group");

		const { error, data } = await supabase
			.from('items')
			.select('*')
			.eq('group_id', $page.params.group)
			.eq('completed', false);

		if (error) throw new Error(error.message);

		items = data;

		supabase
			.channel('public:items')
			.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'items' }, (payload) => {
				items = [...items, payload.new];
			})
			.on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'items' }, (payload) => {
				items = items.filter((m) => m.id !== payload.old.id);
			})
			.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'items' }, (payload) => {
				if (payload.new.completed == true) {
					items = items.filter((m) => m.id !== payload.new.id);
				}
			})
			.subscribe();
	});

	const addItem = async () => {
		if (newItemName == null || newItemName == '') throw new Error('new items must have a name');

		loading = true;

		const { error } = await supabase.from('items').insert([
			{
				name: newItemName,
				group_id: $page.params.group
			}
		]);

		loading = false;

		if (error) throw new Error(error.message);

		newItemName = '';
	};

	const removeItem = async (id: number) => {
		if (id == 0) throw new Error('id cannot be 0');

		const { error } = await supabase.from('items').delete().eq('id', id);

		if (error) throw new Error(error.message);
	};

	const completeItem = async (id: number) => {
		if (id == 0) throw new Error('id cannot be 0');

		const { error } = await supabase.from('items').update({ completed: true }).eq('id', id);

		if (error) throw new Error(error.message);
	};

	onDestroy(() => {
		supabase.removeAllChannels();
	});
</script>

{#await fetchGroup()}
	loading...
{:then data}
	<div class="border-b border-base-300 px-2 py-4">
		<h2 class="text-xl">{data.title}</h2>
	</div>
{/await}

{#if !$page.data.session}
	<span />
{:else}
	<div id="items-container" class="p-2 grow pb-20 flex flex-col justify-end">
		{#each items as item}
			<div class="flex py-2 gap-4 rounded-lg my-2">
				<div>
					<h4 class="font-semibold text-neutral">{item.name}</h4>
					<small class="m-0 primary-content base-content font-mono"
						>{formatDate(item.created_at)}</small
					>
				</div>
				<div class="btn-group ml-auto">
					<button on:click={() => removeItem(item.id)} class="btn btn-outline btn-warning h-full">
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
					<button on:click={() => completeItem(item.id)} class="btn btn-outline btn-success h-full">
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
			</div>
			<hr class="border-base-300" />
		{/each}
	</div>

	<div class="fixed bottom-0 w-full px-2 py-4 backdrop-blur-xl border-t border-primary">
		<form on:submit|preventDefault={addItem}>
			<div class="input-group">
				<input
					bind:value={newItemName}
					type="text"
					placeholder="Add item…"
					class="input input-bordered w-full input-primary"
				/>
				<button class="btn {loading ? 'loading' : ''}">Add</button>
			</div>
		</form>
	</div>
{/if}

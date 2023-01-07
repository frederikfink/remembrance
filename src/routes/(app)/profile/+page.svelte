<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabase } from '$lib/db';
	import Group from './Group.svelte';

	let addGroupTitle: string = '';
	let addGroupDescription: string = '';

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();

		return goto('/sign-in');
	};

	const fetchGroups = async () => {
		const { error, data } = await supabase
			.from('groups')
			.select('*, group_members(member_id)')
			.eq('group_members.member_id', $page.data.session?.user.id);

		if(error) throw new Error(error.message);

		console.log(data);
		
		return data;
	};

	const addGroup = async () => {
		if (addGroupTitle == '') throw new Error('Title cannot be empty');

		const { error, data } = await supabase.from('groups').insert({
			title: addGroupTitle,
			description: addGroupDescription === '' ? null : addGroupDescription,
			created_by: $page.data.session?.user.id
		}).select();

		if (error) throw new Error(error.message);

		goto(`/${data[0].id}`);
	};
</script>

<div>
	<h2 class="py-4 px-2 border-b border-base-300 text-2xl">Groups</h2>
	<div class="py-4 flex flex-col gap-2 border-b border-base-300">
	{#await fetchGroups()}
		<div class="px-2">loading groups..</div>
	{:then groups}
		{#each groups as group}
			<Group
				title={group.title}
				members={0}
				items={0}
				description={group.description}
				id={group.id}
			/>
		{/each}
	{/await}
	</div>

	<div class="flex py-4 px-2">
		<label for="create-group-modal" class="btn gap-2 ml-auto">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
			</svg>
			Create group
		</label>

		<!-- Put this part before </body> tag -->
		<input type="checkbox" id="create-group-modal" class="modal-toggle" />
		<label for="create-group-modal" class="modal cursor-pointer modal-bottom sm:modal-middle">
			<label class="modal-box relative" for="">
				<h3 class="font-semibold text-xl">Create new group</h3>
				<form id="create-group-form" on:submit|preventDefault={addGroup}>
					<div class="w-full">
						<label class="label" for="group-name-input">
							<span class="label-text">Group Title</span>
						</label>
						<input
							bind:value={addGroupTitle}
							id="group-name-input"
							type="text"
							placeholder="Type here"
							class="input input-bordered w-full"
						/>
					</div>
					<div class="w-full">
						<label class="label" for="group-name-input">
							<span class="label-text">Group Description</span>
						</label>
						<input
							bind:value={addGroupDescription}
							id="group-description-input"
							type="text"
							placeholder="Type here"
							class="input input-bordered w-full"
						/>
					</div>
					<div class="flex mt-4">
						<button class="btn btn-success w-full" type="submit">create!</button>
					</div>
				</form>
			</label>
		</label>
	</div>
</div>

<div class="mx-2 mt-24">
	<form on:submit|preventDefault={signOut}>
		<button type="submit" class="btn btn-outline btn-error gap-2"> Log out </button>
	</form>
</div>

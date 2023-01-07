<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/db';
	import Group from './Group.svelte';

	let addGroupTitle:string = '';
	let addGroupDescription:string = '';

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();

		return goto('/sign-in');
	};

	const fetchGroups = async () => {

	}

	const addGroup = async () => {
		console.log('test!');
	}
	
	const updateGroup = async () => {
		
	}
</script>

<div>
	<h2 class="py-8 px-2 border-b border-base-300 text-2xl font-bold">Groups</h2>
	<div class="py-4 flex flex-col gap-2 border-b border-base-300">

		<Group title={'Title'} members={5} items={400} slug={"asd"}/>
		<Group title={'really long title that should break ui somehow but it needs to be really long '} members={0} items={20} slug={"asdasd"}/>
		<Group title={'my'} members={5} items={2} slug={"asdasdasd"}/>
		<Group title={'my title'} members={5} items={400} slug={"asdasdasdasdasd"}/>

	</div>

	<div class="flex py-4 px-2">
		<label for="create-group-modal" class="btn gap-2 ml-auto">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
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
						<input bind:value={addGroupTitle} id="group-name-input" type="text" placeholder="Type here" class="input input-bordered w-full" />
					</div>
					<div class="w-full">
						<label class="label" for="group-name-input">
							  <span class="label-text">Group Description</span>
						</label>
						<input bind:value={addGroupDescription} id="group-description-input" type="text" placeholder="Type here" class="input input-bordered w-full" />
					</div>
				</form>
				<div class="modal-action">
					<input form="create-group-form" type="submit" class="btn btn-success" value="Create!" />
				</div>
			</label>
		</label>	
	</div>


</div>

<div class="mx-2 mt-24">
	<form on:submit|preventDefault={signOut}>
		<button type="submit" class="btn btn-outline btn-error gap-2"> Log out </button>
	</form>
</div>


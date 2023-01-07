<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/db';
	import Group from './Group.svelte';

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();

		return goto('/sign-in');
	};

	const fetchGroups = async () => {

	}
</script>

<div>
	<h2 class="py-8 px-2 border-b border-base-300 text-2xl font-bold">Groups</h2>
	<div class="py-4 flex flex-col gap-2 border-b border-base-300">

		<Group title={'Title'} members={5} items={400} />
		<Group title={'really long title that should break ui somehow but it needs to be really long '} members={0} items={20} />
		<Group title={'my'} members={5} items={2} />
		<Group title={'my title'} members={5} items={400} />

	</div>

	<div class="flex py-4 px-2">
		<button class="btn gap-2 ml-auto">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
			</svg>
			Create group
		</button>
	</div>
		
</div>

<div class="mx-2 mt-24">
	<form on:submit|preventDefault={signOut}>
		<button type="submit" class="btn btn-outline btn-error gap-2"> Log out </button>
	</form>
</div>

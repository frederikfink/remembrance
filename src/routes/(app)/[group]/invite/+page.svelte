<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabase } from '$lib/db';
	import { onMount } from 'svelte';

	console.log($page.params.group);

	const acceptInvite = async () => {
		console.log($page);
		if ($page.params.group == undefined || $page.data.session == undefined)
			throw new Error('bad ids');

		const { error } = await supabase.from('group_members').insert({
			group_id: $page.params.group,
			member_id: $page.data.session.user.id
		});

		if (error) throw new Error(error.message);

		goto(`/${$page.data.group}`);
	};

	onMount(async () => {
		const { data, error } = await supabase
			.from('group_members')
			.select('*')
			.eq('member_id', $page.data.session?.user.id)
			.eq('group_id', $page.params.group);

        if(error) throw new Error(error.message);
        
        if(data[0] !== undefined) goto(`/${$page.params.group}`);
	});
</script>

<div class="h-screen flex items-center justify-center">
	<div class="w-64">
		<div class="py-8">
			<p class="text-sm text-secondary">You've been invited to join</p>
			<h2 class="text-2xl">GROUP NAME</h2>
		</div>
		<form on:submit|preventDefault={acceptInvite}>
			<button class="w-full btn btn-primary">Join!</button>
		</form>
	</div>
</div>

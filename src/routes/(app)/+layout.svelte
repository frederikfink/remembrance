<script>
	import { browser } from '$app/environment';
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabase } from '$lib/db';
	import { redirect } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	
	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		if ($page.data.session === null) {
			if (browser) {
				return goto('/sign-in');
			} else {
				throw redirect(302, '/sign-in');
			}
		}

		return () => {
			data.subscription.unsubscribe();
		};
	});
</script>
<nav class="h-12 w-full fixed border-b flex items-center p-2">
	<a href="/">
		Rɪˈmɛmbr(ə)ns
	</a>
	<a href="/profile" class="avatar placeholder ml-auto">
		<div class="bg-neutral-focus text-neutral-content rounded-full w-8">
			<span class="text-xs capitalize">{($page.data.session.user.email).substring(0, 1)}</span>
		</div>
	</a>
</nav>
<div class="pt-12 h-screen flex flex-col ">
	<slot />
</div>
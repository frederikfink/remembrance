<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/db';

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();

		return goto('/sign-in');
	};
</script>

<div class="m-2">
	<form on:submit|preventDefault={signOut}>
		<button type="submit" class="btn btn-outline btn-error gap-2"> Log out </button>
	</form>
</div>

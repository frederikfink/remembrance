<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/db';

	let email: string;
	let password: string;
	let errorMessage: string = '';
	let loading: boolean = false;

	const signIn = async () => {
		loading = true;

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		loading = false;

		if(error) {
			errorMessage = error.message;
			return;
		}

		return goto('/');
	};
</script>

{#if errorMessage !== ''}
	<div class="alert shadow-lg alert-error fixed rounded-none">
		<div>
		<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
			<span>{errorMessage}</span>
		</div>
		<div class="flex-none">
			<button on:click={() => {errorMessage = ''}} class="btn btn-sm btn-primary">close</button>
		</div>
	</div>
{/if}


<div class="h-screen w-100 flex items-center justify-center">
	<div class="w-64">
		<form on:submit|preventDefault={signIn}>
			<div class="mb-6 prose">
				<h2>Login</h2>
				<label for="email" class="label">
					<span class="label-text">Your email</span>
				</label>
				<input
					bind:value={email}
					type="email"
					id="email"
					class="input input-bordered w-full"
					placeholder=""
					required
					autocomplete="email"
				/>
			</div>
			<div class="mb-6">
				<label for="password" class="label">
					<span class="label-text">Your password</span>
				</label>
				<input
					bind:value={password}
					type="password"
					id="password"
					class="input input-bordered w-full"
					required
					autocomplete="new-password"
				/>
			</div>
			<button type="submit" class="{loading ? 'loading' : ''} btn btn-success btn-wide"
				>Sign in</button
			>
		</form>

		<div class="mt-6">
			<p class="dark:text-neutral-400 text-sm">
				sign up <a class="underline" href="/sign-up">here</a>
			</p>
		</div>
	</div>
</div>

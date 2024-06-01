<script lang="ts">
	import { discordAuth } from '$lib/stores/discord';
	import { balance } from '$lib/stores/game';
	import { page } from '$app/stores';
	import numberWithCommas from '$lib/numberWithCommas';
	import Button from '$lib/components/Button.svelte';
	import { goto } from '$app/navigation';

	const username = $discordAuth?.user.global_name ?? $discordAuth?.user.username ?? 'Guest';
	const userPictureId = $discordAuth?.user.avatar;

	const userPicture = `https://cdn.discordapp.com/avatars/${$discordAuth?.user.id}/${userPictureId}.webp?size=128`;

	function goBack() {
		// pop the last page from the history
		history.back();
	}

	async function handleReset() {
		const response = await fetch('/api/sessions/reset', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			console.error('An error occurred while resetting the game');
			return;
		}

		const data = await response.json();
		balance.set(data.balance);
		goto('/');
	}
</script>

<header class="w-full bg-dark-2 shadow-md py-2 px-2 flex justify-between items-center">
	<span class="opacity-75 w-full text-left flex gap-2 items-center">
		{#if $page.url.pathname === '/'}
			<img
				src={userPicture}
				alt="User Picture"
				class="w-8 h-8 rounded-full inline-block ml-2"
				aria-hidden="true"
			/>
			Welcome, {username}
		{:else}
			<button class="ms-2 hover:brightness-125 duration-300" on:click={() => goBack()}
				>Go Back</button
			>
		{/if}
	</span>

	<div class="w-full text-center">
		<a class="text-blurple-1 font-bold text-2xl hover:brightness-125 duration-300" href="/">
			Discord
			<span>Casino</span>
		</a>
	</div>

	<div class="w-full text-right me-w">
		<span class="font-semibold {$balance <= 0 ? 'text-red-500' : ''}">
			Balance: ${numberWithCommas($balance)}
		</span>
		{#if $balance <= 0}
			<Button theme="secondary" class="py-1 px-2 ms-2 font-semibold" on:click={handleReset}>
				Reset?
			</Button>
		{/if}
	</div>
</header>

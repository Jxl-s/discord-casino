<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { setupDiscordSdk, discordAuth, discordFailLoad } from '$lib/stores/discord';
	import LoadingFail from './LoadingFail.svelte';
	import Loading from './Loading.svelte';
	import Header from './Header.svelte';

	// Load discord's SDK
	onMount(() => {
		setupDiscordSdk();
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

{#if $discordFailLoad}
	<!-- Failed loading -->
	<LoadingFail />
{:else if $discordAuth === null}
	<!-- Currently loading -->
	<Loading />
{:else}
	<!-- Show the welcoming page -->
	<Header />
	<slot />
{/if}

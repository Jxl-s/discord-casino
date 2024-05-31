<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { setupDiscordSdk, discordAuth, discordFailLoad } from '$lib/stores/discord';
	import LoadingFail from './LoadingFail.svelte';
	import Loading from './Loading.svelte';
	import TopBar from './TopBar.svelte';

	// Load discord's SDK
	onMount(() => {
		setupDiscordSdk();
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
	<TopBar />
	<slot />
{/if}

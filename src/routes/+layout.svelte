<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { setupDiscordSdk, discordAuth, discordFailLoad } from '$lib/stores/discord';

	// Load discord's SDK
	setupDiscordSdk();
</script>

{#if $discordFailLoad}
	<p>Failed to load Discord SDK</p>
{:else if $discordAuth === null}
	<p>Loading discord auth...</p>
{:else}
	<slot />
{/if}

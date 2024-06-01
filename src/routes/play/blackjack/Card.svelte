<script lang="ts">
	import BiSuitClub from '$lib/icons/BiSuitClub.svelte';
	import BiSuitDiamond from '$lib/icons/BiSuitDiamond.svelte';
	import BiSuitHeart from '$lib/icons/BiSuitHeart.svelte';
	import BiSuitSpade from '$lib/icons/BiSuitSpade.svelte';
	import type { SvelteComponent } from 'svelte';

	type CardValue = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
	type CardSuit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';

	const suitComponents = {
		Hearts: BiSuitHeart,
		Diamonds: BiSuitDiamond,
		Clubs: BiSuitClub,
		Spades: BiSuitSpade
	} as const;

	const suitColors = {
		Hearts: 'text-red-500',
		Diamonds: 'text-red-500',
		Clubs: 'text-white',
		Spades: 'text-white'
	} as const;

	export let value: CardValue = 'A';
	export let suit: CardSuit = 'Hearts';
	export let faceDown = false;

	const SuitComponent = suitComponents[suit];
</script>

<div
	style="height: 70px; width: 50px;"
	class=" rounded-md shadow flex items-center gap-1 justify-center
	{!faceDown ? 'bg-dark-3/50 ' + suitColors[suit] : 'bg-dark-3/20'}"
>
	{#if faceDown}
		<div style="height: 60px; width: 40px;" class="bg-black/30 rounded-md"></div>
	{:else}
		<span class="text-lg">{value}</span>
		<SuitComponent class="w-4 h-4" />
	{/if}
</div>

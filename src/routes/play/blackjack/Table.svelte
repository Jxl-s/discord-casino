<script lang="ts">
	import { getHandValue } from '$lib/games/blackjack/deck';
	import Card from './Card.svelte';
	import type { Card as ICard } from '$lib/games/blackjack/deck';
	import { fade, scale } from 'svelte/transition';

	export let playerHand: ICard[] = [];
	export let dealerHand: ICard[] = [];
</script>

<div class="mt-6 flex gap-4">
	<div>
		<p>You ({getHandValue(playerHand)})</p>
		<div class="flex gap-2" in:scale out:fade>
			{#each playerHand as card}
				<Card value={card.value} suit={card.suit} />
			{/each}
		</div>
	</div>
	<div>
		<p>Dealer ({getHandValue(dealerHand)})</p>
		<div class="flex gap-2" in:scale out:fade>
			{#each dealerHand as card}
				<Card value={card.value} suit={card.suit} />
			{/each}
			{#if dealerHand.length === 1}
				<Card faceDown={true} />
			{/if}
		</div>
	</div>
</div>

<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
</script>

<h1 class="text-2xl font-bold">Game Choices</h1>
<p class="text-lg text-white/80">Choose a game to play!</p>

<div class="max-w-lg w-full mt-2 flex flex-col gap-2">
	<Button class="py-2 font-semibold" on:click={() => goto('/play/coinflip')}>Coin Flip</Button>
	<Button class="py-2 font-semibold" on:click={() => goto('/play/blackjack')}>
		Black Jack
	</Button>
</div>

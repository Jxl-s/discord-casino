<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Card from './Card.svelte';

	let gameStarted = false;
	let playerTurn = false;
	let betAmount = 0;
</script>

<h1 class="text-2xl font-bold">Blackjack</h1>
<p class="text-lg text-white/80 max-w-xl text-center">
	The game where you try to get as close to 21 without going over.
</p>
<p class="text-sm text-white/80 max-w-lg text-center opacity-50">
	Hint: The deck is not shuffled after each round. You may use a certain strategy to increase your
	chances of winning.
</p>

<!-- Table is here -->
<!-- TODO: Add placeholders and real cards -->
<div class="mt-6 flex gap-4 {gameStarted ? 'opacity-100' : 'opacity-100'}">
	<div>
		<p>You:</p>
		<div class="flex gap-2">
			<Card value={'A'} suit="Hearts" />
			<Card value={'7'} suit="Diamonds" />
			<Card value={'2'} suit="Clubs" />
		</div>
	</div>
	<div>
		<p>Dealer:</p>
		<div class="flex gap-2">
			<Card faceDown={true} />
			<Card value={'7'} suit="Spades" />
		</div>
	</div>
</div>

<!-- Interactions menu -->
<div class="max-w-lg w-full mt-2 flex flex-col gap-2">
	<label for="coinflip-bet-amount">Bet Amount</label>
	<div class="grid grid-cols-2 gap-2">
		<div>
			<input
				id="coinflip-bet-amount"
				step="1"
				class="w-full bg-dark-2 shadow-md rounded-lg px-4 text-lg py-2"
				type="number"
				bind:value={betAmount}
			/>
		</div>
		<Button class="w-full font-semibold">Place Bet</Button>
	</div>
	<div>
		<div class="flex gap-2">
			<Button class="w-full font-semibold py-2" disabled={!playerTurn}>Hit</Button>
			<Button class="w-full font-semibold py-2" disabled={!playerTurn}>Stand</Button>
			<Button class="w-full font-semibold py-2" disabled={!playerTurn}>Double Down</Button>
			<Button class="w-full font-semibold py-2" disabled={!playerTurn}>Split</Button>
		</div>
	</div>
</div>

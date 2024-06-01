<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { balance } from '$lib/stores/game';
	import Card from './Card.svelte';
	import { getHandValue } from '$lib/games/blackjack/deck';
	import type { Card as ICard } from '$lib/games/blackjack/deck';
	import Table from './Table.svelte';

	let gameStarting = false; // for async
	let gameStarted = false;

	let roundStarting = false; // for async
	let roundStarted = false;

	let playerTurn = false;
	let betAmount = 0;
	let betError = '';

	let playerHand: ICard[] = [];
	let dealerHand: ICard[] = [];

	async function handleStartGame() {
		gameStarting = true;
		const response = await fetch('/api/games/blackjack', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		gameStarting = false;
		if (!response.ok) {
			console.error('Failed to start game');
			return;
		}

		const responseJson = await response.json();
		gameStarted = true;

		playerHand = responseJson.playerHand;
		dealerHand = responseJson.dealerHand;
	}

	async function startRound() {
		if (betAmount <= 0) {
			betError = 'Bet amount must be greater than 0';
			return;
		}

		if (betAmount > $balance) {
			betError = 'You do not have enough balance';
			return;
		}

		roundStarting = true;
		const response = await fetch('/api/games/blackjack/round', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ betAmount })
		});

		roundStarting = false;
		if (!response.ok) {
			console.error('Failed to start round');
			return;
		}
	}
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
{#if roundStarted}
	<Table {playerHand} {dealerHand} />
{/if}

<!-- Interactions menu -->
<div class="max-w-lg w-full mt-2 flex flex-col gap-2">
	{#if gameStarted}
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
			<Button class="w-full font-semibold" on:click={startRound}>Place Bet</Button>
		</div>
		{#if betError}
			<p class="text-red-500 text-sm">{betError}</p>
		{/if}
		{#if roundStarted}
			<div class="flex gap-2">
				<Button class="w-full font-semibold py-2" disabled={!playerTurn}>Hit</Button>
				<Button class="w-full font-semibold py-2" disabled={!playerTurn}>Stand</Button>
				<Button class="w-full font-semibold py-2" disabled={!playerTurn}>Double Down</Button>
			</div>
		{/if}
	{:else}
		<Button
			class="w-full font-semibold py-2 mt-3"
			on:click={handleStartGame}
			disabled={gameStarting}>Start Game</Button
		>
	{/if}
</div>

<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { balance } from '$lib/stores/game';
	import Card from './Card.svelte';
	import { getHandValue } from '$lib/games/blackjack/deck';
	import type { Card as ICard } from '$lib/games/blackjack/deck';
	import Table from './Table.svelte';

	enum GameStatus {
		None,
		Tie,
		Win,
		Blackjack,
		Lose
	}

	let gameStarting = false; // for async
	let gameStarted = false;
	let gameStatus = GameStatus.None;

	let roundStarting = false; // for async
	let roundStarted = false;

	let playerTurn = false;
	let betAmount = 0;
	let betError = '';

	let playerHand: ICard[] = [];
	let dealerHand: ICard[] = [];

	async function reset() {
		gameStarting = false;
		gameStarted = true;
		gameStatus = GameStatus.None;

		roundStarting = false;
		roundStarted = false;

		playerTurn = false;
		betAmount = 0;
		betError = '';

		playerHand = [];
		dealerHand = [];
	}

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
		// Reset previous values
		// reset();

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
			body: JSON.stringify({ amount: betAmount })
		});

		roundStarting = false;
		if (!response.ok) {
			console.error('Failed to start round');
			return;
		}

		const responseJson = await response.json();
		balance.set(responseJson.balance);
		playerHand = responseJson.playerHand;
		dealerHand = [responseJson.dealerCard];

		roundStarted = true;
		playerTurn = true;

		if (responseJson.result === 'blackjack') {
			gameStatus = GameStatus.Blackjack;
			playerTurn = false;
		}
	}

	async function hit() {
		playerTurn = false;
		const response = await fetch('/api/games/blackjack/round/hit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		playerTurn = true;
		if (!response.ok) {
			console.error('Failed to hit');
			return;
		}

		const responseJson = await response.json();
		balance.set(responseJson.balance);
		playerHand = responseJson.playerHand;

		if (responseJson.dealerHand) {
			dealerHand = responseJson.dealerHand;
		}

		if (responseJson.result === 'lose') {
			gameStatus = GameStatus.Lose;
			playerTurn = false;
			gameStarted = false;
		} else if (responseJson.result === 'win') {
			gameStatus = GameStatus.Win;
			playerTurn = false;
			gameStarted = false;
		} else if (responseJson.result === 'blackjack') {
			gameStatus = GameStatus.Blackjack;
			playerTurn = false;
			gameStarted = false;
		} else if (responseJson.result === 'tie') {
			gameStatus = GameStatus.Tie;
			playerTurn = false;
			gameStarted = false;
		} else if (responseJson.result === '21') {
			playerTurn = false;
			gameStarted = false;
		}
	}

	async function stand() {
		playerTurn = false;
		const response = await fetch('/api/games/blackjack/round/stand', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		playerTurn = true;
		if (!response.ok) {
			console.error('Failed to stand');
			return;
		}

		const responseJson = await response.json();
		balance.set(responseJson.balance);
		dealerHand = responseJson.dealerHand;

		if (responseJson.result === 'lose') {
			gameStatus = GameStatus.Lose;
			playerTurn = false;
			gameStarted = false;
		} else if (responseJson.result === 'win') {
			gameStatus = GameStatus.Win;
			playerTurn = false;
			gameStarted = false;
		} else if (responseJson.result === 'blackjack') {
			gameStatus = GameStatus.Blackjack;
			playerTurn = false;
			gameStarted = false;
		} else if (responseJson.result === 'tie') {
			gameStatus = GameStatus.Tie;
			playerTurn = false;
			gameStarted = false;
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
	<div class="mt-2 text-center">
		{#if gameStatus === GameStatus.Win}
			<p class="text-green-500 text-lg">You win!</p>
		{/if}
		{#if gameStatus === GameStatus.Lose}
			<p class="text-red-500 text-lg">You lose!</p>
		{/if}
		{#if gameStatus === GameStatus.Blackjack}
			<p class="text-yellow-500 text-lg">Blackjack!</p>
		{/if}
		{#if gameStatus === GameStatus.Tie}
			<p class="text-yellow-500 text-lg">Tie!</p>
		{/if}
	</div>

	{#if gameStarted}
		{#if roundStarted}
			<div class="flex gap-2 mt-2">
				<Button
					class="w-full font-semibold py-2"
					disabled={!roundStarted || !playerTurn}
					on:click={hit}>Hit</Button
				>
				<Button
					class="w-full font-semibold py-2"
					disabled={!roundStarted || !playerTurn}
					on:click={stand}>Stand</Button
				>
				<Button class="w-full font-semibold py-2" disabled={!roundStarted || !playerTurn}
					>Double Down</Button
				>
			</div>
		{:else}
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
				<Button class="w-full font-semibold" on:click={startRound} disabled={roundStarting}
					>Place Bet</Button
				>
			</div>
			{#if betError}
				<p class="text-red-500 text-sm">{betError}</p>
			{/if}
		{/if}
	{:else if gameStatus === GameStatus.None}
		<Button
			class="w-full font-semibold py-2 mt-3"
			on:click={handleStartGame}
			disabled={gameStarting}>Start Game</Button
		>
	{:else}
		<Button class="w-full font-semibold py-2 mt-3" on:click={() => reset()} disabled={gameStarting}
			>Do Another Game</Button
		>
	{/if}
</div>

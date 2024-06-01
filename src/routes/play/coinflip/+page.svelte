<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import numberWithCommas from '$lib/numberWithCommas';
	import { balance } from '$lib/stores/game';

	let betAmount = 0;

	enum BetStatus {
		None,
		Waiting,
		Heads,
		Tails
	}

	let betSide = BetStatus.Heads;
	let betResult = BetStatus.None;
	let errorText = '';

	async function flipCoin() {
		if (betAmount <= 0) {
			errorText = 'Bet amount must be greater than 0';
			return;
		}

		if (betAmount > $balance) {
			errorText = 'You do not have enough balance to place this bet';
			return;
		}

		betResult = BetStatus.Waiting;
		const response = await fetch('/api/games/coinflip', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				amount: betAmount,
				side: betSide === BetStatus.Heads ? 'heads' : 'tails'
			})
		});

		if (!response.ok) {
			errorText = 'An error occurred while flipping the coin';
			betResult = BetStatus.None;
			return;
		}

		const data = await response.json();
		betResult = data.result === 'heads' ? BetStatus.Heads : BetStatus.Tails;
		balance.set(data.balance);
	}
</script>

<h1 class="text-2xl font-bold">Coin Flip</h1>
<p class="text-lg text-white/80">The classic coin flip game!</p>

<div class="max-w-lg w-full mt-6 flex flex-col gap-2">
	<div class="grid grid-cols-2 gap-2">
		<div>
			<label for="coinflip-bet-amount">Bet Amount</label>
			<input
				id="coinflip-bet-amount"
				step="1"
				class="w-full bg-dark-2 shadow-md rounded-lg px-4 text-lg py-2"
				type="number"
				bind:value={betAmount}
			/>
		</div>

		<div>
			<label for="coinflip-side">Chosen side</label>
			<select
				id="coinflip-side"
				class="w-full bg-dark-2 shadow-md rounded-lg px-4 text-lg py-2"
				bind:value={betSide}
			>
				<option value={BetStatus.Heads}>Heads</option>
				<option value={BetStatus.Tails}>Tails</option>
			</select>
		</div>
	</div>
	{#if errorText}
		<p class="text-red-500">{errorText}</p>
	{/if}
	<Button className="py-2 font-semibold" on:click={flipCoin}>Flip Coin</Button>
	{#if betResult !== BetStatus.None}
		<div class="fixed w-full h-full bg-black/50 top-0 left-0 flex items-center justify-center">
			<div class="max-w-xl w-full bg-dark-2 rounded-lg pt-2 pb-4 px-4">
				<header class="font-semibold text-lg">Bet Status</header>
				<hr class="mt-1 mb-2" />
				{#if betResult === BetStatus.Waiting}
					<p>Flipping the coin...</p>
				{:else}
					<p>
						The coin landed on <span
							class="font-semibold
							{betSide === betResult ? 'text-green-500' : 'text-red-500'}"
						>
							{betResult === BetStatus.Heads ? 'Heads' : 'Tails'}
						</span>
					</p>
					<p>
						You have
						<span class="{betSide === betResult ? 'text-green-500' : 'text-red-500'} font-semibold">
							{betSide === betResult ? 'won' : 'lost'}
							${numberWithCommas(betAmount)}
						</span>. Your current balance is ${numberWithCommas($balance)}
					</p>
					<Button className="py-2 mt-2" on:click={() => (betResult = BetStatus.None)}>Close</Button>
				{/if}
			</div>
		</div>
	{/if}
</div>

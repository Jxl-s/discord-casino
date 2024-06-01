<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';

	let betAmount = 0;
</script>

<h1 class="text-2xl font-bold">Coin Flip</h1>
<p class="text-lg text-white/80">The classic coin flip game!</p>

<div class="max-w-lg w-full mt-6 flex flex-col gap-2">
	<div class="grid grid-cols-2 gap-2">
		<div>
			<label for="coinflip-bet-amount">Bet Amount</label>
			<input
				id="coinflip-bet-amount"
				class="w-full bg-dark-2 shadow-md rounded-lg px-4 text-lg py-2"
				type="number"
				bind:value={betAmount}
			/>
		</div>

		<div>
			<label for="coinflip-side">Chosen side</label>
			<select id="coinflip-side" class="w-full bg-dark-2 shadow-md rounded-lg px-4 text-lg py-2">
				<option value="heads">Heads</option>
				<option value="tails">Tails</option>
			</select>
		</div>
	</div>

	<Button className="py-2 font-semibold">Place Bet</Button>
</div>

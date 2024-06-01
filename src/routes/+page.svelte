<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
</script>

<h1 class="animate-pulse text-6xl font-bold text-blurple-1">Discord Casino</h1>
<p class="text-lg text-white/80">Become a professional gambler today and be rich!</p>

<div class="max-w-lg w-full mt-4 flex flex-col gap-2">
	<Button className="py-2 font-semibold text-xl" on:click={() => goto('/play')} theme="primary">
		Play
	</Button>
	<Button
		className="py-2 font-semibold text-xl"
		on:click={() => goto('/settings')}
		theme="secondary"
	>
		Settings
	</Button>
	<Button
		className="py-2 font-semibold text-xl"
		on:click={() => goto('/leaderboards')}
		theme="secondary"
	>
		Leaderboards
	</Button>
</div>

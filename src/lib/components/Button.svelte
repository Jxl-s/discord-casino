<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let className = '';
	export let theme: keyof typeof themes = 'primary';

	const themes = {
		primary: 'bg-blue-500 text-white',
		secondary: 'bg-gray-500 text-white'
	};

	const dispatch = createEventDispatcher();
</script>

<button
	class="rounded-lg shadow-md hover:brightness-125 duration-300 text-center {className} {themes[
		theme
	]}"
	on:click={() => dispatch('click')}
>
	<slot />
</button>

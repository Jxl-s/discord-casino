<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let theme: keyof typeof themes = 'primary';
	export let disabled = false;

	const themes = {
		primary: 'bg-blue-500 text-white',
		secondary: 'bg-gray-500 text-white'
	};

	const dispatch = createEventDispatcher();
</script>

<button
	class="rounded-lg shadow-md {disabled ? '' : 'hover:brightness-125'} duration-300 text-center disabled:opacity-50 {$$props.class} {themes[
		theme
	]}"
	{disabled}
	on:click={() => dispatch('click')}
>
	<slot />
</button>

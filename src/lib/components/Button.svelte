<script lang="ts">
	export let className = '';
	export let theme: keyof typeof themes = 'primary';

	const themes = {
		primary: 'bg-blue-500 text-white',
		secondary: 'bg-gray-500 text-white'
	};
</script>

<button
	class="rounded-lg w-full shadow-md hover:brightness-125 duration-300 text-center {className} {themes[
		theme
	]}"
>
	<slot />
</button>

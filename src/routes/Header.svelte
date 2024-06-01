<script lang="ts">
	import { discordAuth } from '$lib/stores/discord';
	import { balance } from '$lib/stores/game';
	import { page } from '$app/stores';

	const username = $discordAuth?.user.global_name ?? $discordAuth?.user.username ?? 'Guest';
	const userPictureId = $discordAuth?.user.avatar;

	const userPicture = `https://cdn.discordapp.com/avatars/${$discordAuth?.user.id}/${userPictureId}.webp?size=128`;

	const pageNames = {
		'/': 'Home',
		'/play': 'Choose a Game',
		'/settings': 'Settings',
		'/leaderboards': 'Leaderboards'
	} as Record<string, string>;
</script>

<header class="w-full bg-dark-2 shadow-md py-2 px-2 flex justify-between items-center">
	<span class="opacity-75 w-full text-left flex gap-2 items-center">
		{#if $page.url.pathname === '/'}
			<img
				src={userPicture}
				alt="User Picture"
				class="w-8 h-8 rounded-full inline-block ml-2"
				aria-hidden="true"
			/>
			Welcome, {username}
		{:else if $page.url.pathname in pageNames}
			<span class="ms-2">{pageNames[$page.url.pathname]}</span>
		{/if}
	</span>

	<div class="w-full text-center">
		<a class="text-blurple-1 font-bold text-2xl hover:brightness-125 duration-300" href="/">
			Discord
			<span>Casino</span>
		</a>
	</div>

	<span class="font-semibold w-full text-right me-2">Balance: ${$balance}</span>
</header>

import { PUBLIC_DISCORD_CLIENT_ID } from '$env/static/public';

import { DiscordSDK } from '@discord/embedded-app-sdk';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { updateBalance } from './game';

type PromiseType<T extends Promise<any>> = T extends Promise<infer U> ? U : never;
type AuthType = PromiseType<ReturnType<typeof discordSdk.commands.authenticate>>;

export const discordAuth = writable<AuthType | null>(null);
export const discordFailLoad = writable(false);

// Discord SDK setup
const discordSdk = new DiscordSDK(PUBLIC_DISCORD_CLIENT_ID);

export async function setupDiscordSdk() {
	await discordSdk.ready();

	try {
		// Get the code from the Discord SDK
		const { code } = await discordSdk.commands.authorize({
			client_id: PUBLIC_DISCORD_CLIENT_ID,
			response_type: 'code',
			state: '',
			prompt: 'none',
			scope: ['identify', 'guilds']
		});

		// Retrieve an access_token from your activity's server
		const response = await fetch('/api/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				code
			})
		});

		if (response.status !== 200) {
			throw new Error('Failed to fetch token');
		}

		// Parse the response and authenticate the user
		const { access_token } = await response.json();
		const auth = await discordSdk.commands.authenticate({
			access_token
		});

		if (auth == null) {
			throw new Error('Authenticate command failed');
		}

		// Update the store
		discordAuth.set(auth);

		// Update balance
		await updateBalance();

		discordSdk.commands.setActivity({
			activity: {
				details: "Gambling my kid's college savings",
				state: 'In the casino',
				party: {
					size: [1, 1]
				}
			}
		});
	} catch (e) {
		console.error(e);
		discordFailLoad.set(true);
	}
}

// Prevent session from being deleted
if (browser) {
	console.log('Starting ping interval');
	setInterval(async () => {
		// Ping the app every minute
		const response = await fetch('/api/sessions/ping');
		if (response.ok) {
			console.log('Pinged the server');
		}
	}, 60 * 1000);
}

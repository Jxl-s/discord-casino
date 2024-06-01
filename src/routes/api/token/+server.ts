import { DISCORD_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_DISCORD_CLIENT_ID } from '$env/static/public';
import { Deck } from '$lib/games/blackjack/deck';
import { createToken, getSession, setSession } from '$lib/sessions.server';
import { json } from '@sveltejs/kit';
import { z } from 'zod';

const schema = z.object({
	code: z.string()
});

export async function POST({ request, cookies }) {
	const body = await request.json();

	// Try to parse the body
	try {
		const { code } = schema.parse(body);
		const response = await fetch(`https://discord.com/api/oauth2/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				client_id: PUBLIC_DISCORD_CLIENT_ID,
				client_secret: DISCORD_CLIENT_SECRET,
				grant_type: 'authorization_code',
				code
			})
		});

		// Retrieve the access_token from the response
		const resJson = await response.json();
		const { access_token } = resJson;
		if (!access_token) {
			throw new Error('Failed to fetch access_token');
		}

		// Try fetching the user ID to create a JWT
		const userResponse = await fetch('https://discord.com/api/users/@me', {
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		});

		if (!response.ok) {
			throw new Error('Failed to fetch user data');
		}

		// Create a token with the user ID
		const userJson = await userResponse.json();
		const userId = userJson.id;
		const token = createToken({
			sub: userId
		});

		cookies.set('token', token, {
			path: '/',
			maxAge: 60 * 60 * 10,
			sameSite: 'none'
		});

		// Create a session as well
		if (!getSession(userId)) {
			setSession(userId, {
				userId,
				balance: 100,
				lastUpdate: Date.now()
			});
		}

		return json({ access_token }, { status: 200 });
	} catch (e) {
		console.error(e);
		return json({ message: 'Error fetching' }, { status: 400 });
	}
}

import { DISCORD_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_DISCORD_CLIENT_ID } from '$env/static/public';
import { json } from '@sveltejs/kit';
import { z } from 'zod';

const schema = z.object({
	code: z.string()
});

export async function POST({ request }) {
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
		const { access_token } = await response.json();
		if (!access_token) {
			throw new Error('Failed to fetch access_token');
		}

		return json({ access_token }, { status: 200 });
	} catch (error) {
		return json({ message: 'Error fetching ' }, { status: 400 });
	}
}

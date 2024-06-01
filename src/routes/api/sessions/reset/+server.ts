import { extractSession } from '$lib/sessions.server.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ cookies }) {
	const session = extractSession(cookies);
	if (!session) return error(401, 'Unauthorized');

	session.balance = 100;
	return json({ balance: session.balance });
}

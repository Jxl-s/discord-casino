import { extractSession } from '$lib/sessions.server.js';
import { error, json } from '@sveltejs/kit';

export async function GET({ cookies }) {
	const session = extractSession(cookies);
	if (!session) return error(401, 'Unauthorized');

	session.lastUpdate = Date.now();
	return json({ status: 'ok' });
}

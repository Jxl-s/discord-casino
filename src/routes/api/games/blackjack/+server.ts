import { createBlackjackSession } from '$lib/games/blackjack/index.server.js';
import { extractSession, getSession } from '$lib/sessions.server';
import { error, json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

export async function POST({ cookies }) {
	const session = extractSession(cookies);
	if (!session) return error(401, 'Unauthorized');

	createBlackjackSession(session.userId);
	return json({
		status: 'ok'
	});
}

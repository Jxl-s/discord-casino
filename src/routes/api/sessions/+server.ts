import { extractSession, getSession, verifyToken } from '$lib/sessions.server';
import { error, json } from '@sveltejs/kit';

export async function GET({ cookies }) {
	const session = extractSession(cookies);
	if (!session) return error(401, 'Unauthorized');

	return json({ data: session });
}

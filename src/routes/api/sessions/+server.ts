import { getSession, verifyToken } from '$lib/sessions.server';
import { error, json } from '@sveltejs/kit';

export async function GET({ cookies }) {
	const token = cookies.get('token');
	if (!token) return error(401, 'Unauthorized');

	const verifiedToken = verifyToken(token);
	if (!verifiedToken) return error(401, 'Unauthorized');
	if (!verifiedToken.sub) return error(401, 'Unauthorized');

	const sessionData = getSession(verifiedToken.sub);
	return json({ data: sessionData });
}

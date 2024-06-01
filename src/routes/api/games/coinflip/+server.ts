import { extractSession } from '$lib/sessions.server.js';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';

const schema = z.object({
	amount: z.number().int().min(1),
	side: z.enum(['heads', 'tails'])
});

export async function POST({ cookies, request }) {
	const session = extractSession(cookies);
	if (!session) return error(401, 'Unauthorized');

	const body = await request.json();
	try {
		const data = schema.parse(body);
		const { amount, side } = data;

		if (amount > session.balance) {
			return error(400, 'Insufficient funds');
		}

		// Random generator
		const result = Math.random() >= 0.5 ? 'heads' : 'tails';
		const win = result === side;

		// Update user balance
		if (win) {
			session.balance += amount;
		} else {
			session.balance -= amount;
		}

		return json({
			result,
			balance: session.balance
		});
	} catch (e) {
		return error(400, 'Bad request');
	}
}

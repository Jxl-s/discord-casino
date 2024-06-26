import { getHandValue } from '$lib/games/blackjack/deck.js';
import { getBlackjackSession } from '$lib/games/blackjack/index.server.js';
import { extractSession } from '$lib/sessions.server.js';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';

const schema = z.object({
	amount: z.number().int().min(1)
});

export async function POST({ cookies, request }) {
	const session = extractSession(cookies);
	if (!session) return error(401, 'Unauthorized');

	const blackjackSession = getBlackjackSession(session.userId);
	if (!blackjackSession) return error(404, 'Blackjack session not found');

	const body = await request.json();
	try {
		const data = schema.parse(body);
		const { amount } = data;

		// Upadte the balance
		blackjackSession.amount = amount;
		session.balance -= amount;

		// Distribute cards
		const { deck } = blackjackSession;
		blackjackSession.started = true;
		blackjackSession.playerHand = [deck.getCard(), deck.getCard()];
		// blackjackSession.playerHand = [
		// 	{ value: '10', suit: 'Hearts' },
		// 	{ value: 'A', suit: 'Hearts' }
		// ]; for testing blackjack case
		blackjackSession.dealerHand = [deck.getCard(), deck.getCard()];

		// Handle blackjack
		if (getHandValue(blackjackSession.playerHand) === 21) {
			session.balance += amount * 2.5;
			blackjackSession.started = false;

			return json({
				balance: session.balance,
				playerHand: blackjackSession.playerHand,
				dealerCard: blackjackSession.dealerHand[0],
				result: 'blackjack'
			});
		}

		return json({
			balance: session.balance,
			playerHand: blackjackSession.playerHand,
			dealerCard: blackjackSession.dealerHand[0]
		});
	} catch (e) {
		return error(400, 'Bad request');
	}
}

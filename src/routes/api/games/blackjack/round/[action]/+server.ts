import { Deck, getHandValue, type Card } from '$lib/games/blackjack/deck.js';
import { getBlackjackSession } from '$lib/games/blackjack/index.server.js';
import { extractSession, type Session } from '$lib/sessions.server.js';
import { error, json } from '@sveltejs/kit';

// Determine whether the game is ongoing, won, lost, or tied
function getHitResult(playerHand: Card[]) {
	const playerValue = getHandValue(playerHand);

	if (playerValue === 21 && playerHand.length === 2) return 'blackjack';
	if (playerValue === 21) return '21';
	if (playerValue > 21) return 'lose';

	return 'ok';
}

function dealerTurn(dealerHand: Card[], deck: Deck) {
	let dealerValue = getHandValue(dealerHand);

	while (dealerValue < 17) {
		dealerHand.push(deck.getCard());
		dealerValue = getHandValue(dealerHand);
	}

	return dealerHand;
}

async function hit(session: Session) {
	const blackjackSession = getBlackjackSession(session.userId);
	if (!blackjackSession) return error(404, 'Blackjack session not found');

	if (!blackjackSession.started) return error(400, 'Round has not started yet');

	// Add a card
	const { deck } = blackjackSession;
	const card = deck.getCard();
	blackjackSession.playerHand.push(card);

	// Handle result
	let roundStatus = getHitResult(blackjackSession.playerHand);
	if (roundStatus === 'blackjack') {
		session.balance += blackjackSession.amount * 2.5;
	} else if (roundStatus === 'lose') {
		blackjackSession.started = false;

		const response = json({
			balance: session.balance,
			playerHand: blackjackSession.playerHand,
			result: roundStatus
		});

		// Reset the game
		blackjackSession.playerHand = [];
		blackjackSession.dealerHand = [];

		return response;
	} else if (roundStatus === '21') {
		blackjackSession.started = false;

		// dealer's turn now
		const dealerHand = dealerTurn(blackjackSession.dealerHand, deck);
		const dealerValue = getHandValue(dealerHand);

		// Check if we win or tie
		if (dealerValue === getHandValue(blackjackSession.playerHand)) {
			session.balance += blackjackSession.amount;
			roundStatus = 'tie';

			return json({
				balance: session.balance,
				playerHand: blackjackSession.playerHand,
				dealerHand: dealerHand,
				result: roundStatus
			});
		} else {
			session.balance += blackjackSession.amount * 2;
			roundStatus = 'win';
		}
	}

	return json({
		balance: session.balance,
		playerHand: blackjackSession.playerHand,
		result: roundStatus
	});
}

async function stand(session: Session) {
	const blackjackSession = getBlackjackSession(session.userId);
	if (!blackjackSession) return error(404, 'Blackjack session not found');
	if (!blackjackSession.started) return error(400, 'Round has not started yet');

	const dealerHand = dealerTurn(blackjackSession.dealerHand, blackjackSession.deck);
	const dealerValue = getHandValue(dealerHand);

	// Handle win, tie, or lose
	const playerValue = getHandValue(blackjackSession.playerHand);
	let roundStatus = 'lose';
	if (playerValue > dealerValue || dealerValue > 21) {
		session.balance += blackjackSession.amount * 2;
		roundStatus = 'win';
	} else if (playerValue === dealerValue) {
		session.balance += blackjackSession.amount;
		roundStatus = 'tie';
	}

	blackjackSession.started = false;

	const response = json({
		balance: session.balance,
		dealerHand,
		result: roundStatus
	});

	// Reset the game
	blackjackSession.playerHand = [];
	blackjackSession.dealerHand = [];

	return response;
}

async function doubleDown(session: Session) {
	const blackjackSession = getBlackjackSession(session.userId);
	if (!blackjackSession) return error(404, 'Blackjack session not found');

	if (!blackjackSession.started) return error(400, 'Round has not started yet');
	if (isRoundFinished(blackjackSession.playerHand, blackjackSession.dealerHand) !== 'ok') {
		return error(400, 'Round is already finished');
	}
}

export async function POST({ cookies, params }) {
	const session = extractSession(cookies);
	if (!session) return error(401, 'Unauthorized');

	const { action } = params;
	if (action === 'hit') {
		return hit(session);
	} else if (action === 'stand') {
		return stand(session);
	} else if (action === 'doubleDown') {
		return doubleDown(session);
	}

	return error(400, 'Invalid action');
}
